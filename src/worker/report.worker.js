const BaseWorker = require('./base.worker');
const RecurrenceRules = require('./recurrenceRule');
const cron = require('node-cron');

class ReportWorker extends BaseWorker {
    constructor() {
        super();
        this.recurrenceRules = new RecurrenceRules();
    }

    start = () => {
        // this.recurrenceRules.second = "*";
        this.recurrenceRules.minute = "*";
        this.recurrenceRules.hour = "*";
        this.recurrenceRules.dayOfMonth = "*";
        this.recurrenceRules.month = "*";
        this.recurrenceRules.dayOfWeek = "*";

        const rules = this.recurrenceRules.getRules();

        const worker1 = cron.schedule(rules, () => {
            console.log("Run worker 1");
        });

        const worker2 = cron.schedule(rules, () => {
            console.log("Run worker 2");
        });
    }
}

module.exports = ReportWorker;