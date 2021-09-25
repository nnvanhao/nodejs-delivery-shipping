class RecurrenceRule {
    constructor() {
        this.second = null;
        this.minute = null;
        this.hour = null;
        this.dayOfMonth = null;
        this.month = null;
        this.dayOfWeek = null;
    }

    getRules = () => {
        let rules = [];
        let rulesString = null;

        if (this.second) {
            rules.push(this.second);
        }
        if (this.minute) {
            rules.push(this.minute);
        }
        if (this.hour) {
            rules.push(this.hour);
        }
        if (this.dayOfMonth) {
            rules.push(this.dayOfMonth);
        }
        if (this.month) {
            rules.push(this.month);
        }
        if (this.dayOfWeek) {
            rules.push(this.dayOfWeek);
        }

        rulesString = rules.toString();
        rulesString = rulesString.split(",").join(" ");

        return rulesString;
    }
}

module.exports = RecurrenceRule;