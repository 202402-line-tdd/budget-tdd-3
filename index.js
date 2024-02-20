const dayjs = require("dayjs");

const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isBetween);

class BudgetService {
  query(start, end) {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    // start > end
    if (startDate.isAfter(endDate)) {
      return 0;
    }

    const startMonth = startDate.format("YYYYMM");
    const endMonth = endDate.format("YYYYMM");
    const startMonthDays = startDate.daysInMonth();

    const data = this.getAll().filter((budget) => {
      const yearMonth = dayjs(budget.yearMonth);

      return yearMonth.isBetween(startDate, endDate, "month", "[]");
    });

    return data
      .map((budget) => {
        const daysInMonth = dayjs(budget.yearMonth).daysInMonth();

        // same month
        if (startMonth === endMonth) {
          return (
            (budget.amount / daysInMonth) *
            (endDate.diff(startDate, "days") + 1)
          );
        }

        // cross moth
        if (budget.yearMonth === startMonth) {
          const startDays = startMonthDays - startDate.get("date") + 1;
          return (budget.amount / daysInMonth) * startDays;
        } else if (budget.yearMonth === endMonth) {
          return (budget.amount / daysInMonth) * endDate.get("date");
        } else {
          return budget.amount;
        }
      })
      .reduce((sum, current) => {
        return (sum += current);
      }, 0);
  }

  getAll() {}
}

module.exports = BudgetService;
