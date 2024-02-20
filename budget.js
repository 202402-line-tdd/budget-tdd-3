const dayjs = require("dayjs");
const Period = require("./Period");

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
    createPeriod() {
        return new Period(this.firstDay(), this.lastDay());
    }
    overlappingAmount(period) {
        return this.dailyAmount() * period.overlappingDays(this.createPeriod());
    }
}

module.exports = Budget;
