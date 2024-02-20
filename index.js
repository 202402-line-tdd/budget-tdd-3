const dayjs = require("dayjs");

const isBetween = require("dayjs/plugin/isBetween");
const Period = require("./Period");

dayjs.extend(isBetween);

class BudgetService {
    query(start, end) {
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        if (startDate.isAfter(endDate)) {
            return 0;
        }

        // const startMonthDays = startDate.daysInMonth();
        //
        // const filterBudgets = this.getAll().filter((budget) => {
        //     const yearMonth = dayjs(budget.yearMonth);
        //     return yearMonth.isBetween(startDate, endDate, "month", "[]");
        // });

        const period = new Period(startDate, endDate);
        return this.getAll()
            .map((budget) => {
                return budget.overlappingAmount(period);
            })
            .reduce((sum, current) => (sum + current), 0);
    }

    getAll() {
    }
}

module.exports = BudgetService;
