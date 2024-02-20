const dayjs = require("dayjs");

class Budget {
    constructor(yearMonth, amount) {
        this.yearMonth = yearMonth;
        this.amount = amount;
    }
    days() {
        return dayjs(this.yearMonth).daysInMonth();
    }
}
module.exports = Budget;
