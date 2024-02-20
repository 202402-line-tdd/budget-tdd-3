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

        const startMonth = startDate.format("YYYYMM");
        const endMonth = endDate.format("YYYYMM");
        // const startMonthDays = startDate.daysInMonth();

        const filterBudgets = this.getAll().filter((budget) => {
            const yearMonth = dayjs(budget.yearMonth);
            return yearMonth.isBetween(startDate, endDate, "month", "[]");
        });

        return filterBudgets
            .map((budget) => {
                if (startMonth === endMonth) {
                    let overlappingDays = endDate.diff(startDate, "days") + 1;
                    return budget.dailyAmount() * overlappingDays;
                }

                let overlappingDays;
                if (budget.yearMonth === startMonth) {
                    overlappingDays = budget.lastDay().diff(startDate, 'days') + 1;
                } else if (budget.yearMonth === endMonth) {
                    overlappingDays = endDate.diff(budget.firstDay(), 'days') + 1;
                } else {
                    overlappingDays = budget.lastDay().diff(budget.firstDay(), 'days') + 1;
                    // overlappingDays = budget.days();
                }
                return budget.dailyAmount() * overlappingDays;
            })
            .reduce((sum, current) => (sum + current), 0);
    }

    getAll() {
    }
}

module.exports = BudgetService;
