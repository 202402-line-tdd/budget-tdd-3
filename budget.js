const dayjs = require("dayjs");

class Budget {
    constructor(yearMonth, amount) {
        this.yearMonth = yearMonth;
        this.amount = amount;
    }

    days() {
        return this.getYearMonth().daysInMonth();
    }

    getYearMonth() {
        return dayjs(this.yearMonth);
    }

    dailyAmount() {
        return this.amount / this.days();
    }

    firstDay() {
        return this.getYearMonth();
    }

    lastDay() {
        return this.getYearMonth().endOf('month');
    }
}

module.exports = Budget;
