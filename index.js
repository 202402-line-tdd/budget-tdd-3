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

    overlappingDays(budget) {
        let overlappingEnd = this.endDate.isBefore(budget.lastDay()) ? this.endDate : budget.lastDay();
        let overlappingStart = this.startDate.isAfter(budget.firstDay()) ? this.startDate : budget.firstDay();
        if (budget.yearMonth === this.startDate.format("YYYYMM")) {
            // overlappingEnd = budget.lastDay();
            // overlappingStart = this.startDate;
        } else {
            if (budget.yearMonth === this.endDate.format("YYYYMM")) {
                // overlappingEnd = this.endDate;
                // overlappingStart = budget.firstDay();
            } else {
                // overlappingEnd = budget.lastDay();
                // overlappingStart = budget.firstDay();
            }
        }
        return overlappingEnd.diff(overlappingStart, 'days') + 1;
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
                const period = new Period(startDate, endDate);
                let overlappingDays = period.overlappingDays(budget);
                return budget.dailyAmount() * overlappingDays;
            })
            .reduce((sum, current) => (sum + current), 0);
    }

    getAll() {
    }
}

module.exports = BudgetService;
