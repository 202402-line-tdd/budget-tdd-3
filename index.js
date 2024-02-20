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
        const another = new Period(budget.firstDay(), budget.lastDay());
        let lastDay = budget.lastDay();
        let firstDay = budget.firstDay();
        let overlappingEnd = this.endDate.isBefore(lastDay) ? this.endDate : lastDay;
        let overlappingStart = this.startDate.isAfter(firstDay) ? this.startDate : firstDay;
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
