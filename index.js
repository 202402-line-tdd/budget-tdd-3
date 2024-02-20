const dayjs = require("dayjs");

const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isBetween);

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
        let overlappingEnd;
        let overlappingStart;
        if (budget.yearMonth === startDate.format("YYYYMM")) {
            overlappingEnd = budget.lastDay();
            overlappingStart = startDate;
        } else if (budget.yearMonth === endDate.format("YYYYMM")) {
            overlappingEnd = endDate;
            overlappingStart = budget.firstDay();
        } else {
            overlappingEnd = budget.lastDay();
            overlappingStart = budget.firstDay();
        }
        let overlappingDays = overlappingEnd.diff(overlappingStart, 'days') + 1;
        return overlappingDays;
    }

    getAll() {
    }
}

module.exports = BudgetService;
