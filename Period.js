class Period {
    startDate;
    endDate;

    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    overlappingDays(another) {
        if (this.endDate.isBefore(another.startDate) || this.startDate.isAfter(another.endDate)) {
            return 0;
        }
        let overlappingEnd = this.endDate.isBefore(another.endDate) ? this.endDate : another.endDate;
        let overlappingStart = this.startDate.isAfter(another.startDate) ? this.startDate : another.startDate;
        return overlappingEnd.diff(overlappingStart, 'days') + 1;
    }

}

module.exports = Period;
