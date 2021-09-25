const cron = require('node-cron');

class BaseWorker {
    reStartWorker = (worker) => {
        try {
            return worker.start();
        } catch (error) {
            console.log(error.message);
        }
    }

    stopWorker = (worker) => {
        try {
            return worker.stop();
        } catch (error) {
            console.log(error.message);
        }
    }

    destroyWorker = (worker) => {
        try {
            return worker.destroy();
        } catch (error) {
            console.log(error.message);
        }
    }

    validate = (workerConfig) => {
        const result = cron.validate(workerConfig);
        if (!result) {
            console.log("Validate that the given string is a invalid cron rules.");
        }
    }
}

module.exports = BaseWorker;