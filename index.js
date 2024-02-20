const dayjs = require("dayjs");

const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isBetween);

class Period {
    startDate;
    endDate;

    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

}

class BudgetService {
    query(start, end) {
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        if (startDate.isAfter(endDate)) {
            return 0;
        }

        // const startMonthDays = startDate.daysInMonth();

        const filterBudgets = this.getAll().filter((budget) => {
            const yearMonth = dayjs(budget.yearMonth);
            return yearMonth.isBetween(startDate, endDate, "month", "[]");
        });

        return filterBudgets
            .map((budget) => {
                if (startDate.format("YYYYMM") === endDate.format("YYYYMM")) {
                    let overlappingDays = endDate.diff(startDate, "days") + 1;
                    return budget.dailyAmount() * overlappingDays;
                }
                let overlappingDays = this.overlappingDays(budget, startDate, endDate);
                return budget.dailyAmount() * overlappingDays;
            })
            .reduce((sum, current) => (sum + current), 0);
    }

    overlappingDays(budget, startDate, endDate) {
        const period = new Period(startDate, endDate);
        let overlappingEnd;
        let overlappingStart;
        if (budget.yearMonth === period.startDate.format("YYYYMM")) {
            overlappingEnd = budget.lastDay();
            overlappingStart = period.startDate;
        } else {
            if (budget.yearMonth === period.endDate.format("YYYYMM")) {
                overlappingEnd = period.endDate;
                overlappingStart = budget.firstDay();
            } else {
                overlappingEnd = budget.lastDay();
                overlappingStart = budget.firstDay();
            }
        }
        return overlappingEnd.diff(overlappingStart, 'days') + 1;
    }

    getAll() {
    }
}

module.exports = BudgetService;
