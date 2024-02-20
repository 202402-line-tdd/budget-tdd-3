const dayjs = require("dayjs");

class Budget {
    constructor(yearMonth, amount) {
        this.yearMonth = yearMonth;
        this.amount = amount;
    }
    days() {
        return dayjs(this.yearMonth).daysInMonth();
    }
    dailyAmount() {
        return this.amount / this.days();
    }
}
module.exports = Budget;
