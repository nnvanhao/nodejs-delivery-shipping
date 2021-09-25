const config = require('../src/config/env');
const https = require('https');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Logger = require('../src/helpers/logger.helper');
const { normalizePort } = require('../src/helpers/server.helper');
const { LOGGER_TYPE } = require('../src/constants/common.constant');
const logger = new Logger();

exports.create = function (app) {
    const isRunCluster = config.CLUSTER;
    // Init cluster
    if (isRunCluster && cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        // Start server
        let server = https.createServer(app);
        const port = normalizePort(config.PORT);

        server = app.listen(port, function () {
            const host = server.address().address;
            const port = server.address().port;
            console.log('Server started. Listening at host: ' + host + ' - port: ' + port);
        });

        // Handle server error
        server.on('error', function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    logger.log(`${bind} requires elevated privileges at: ${new Date()}`, LOGGER_TYPE.ERROR);
                    break;

                case 'EADDRINUSE':
                    logger.log(`${bind} is already in use at: ${new Date()}`, LOGGER_TYPE.ERROR);
                    break;

                default:
                    throw error;
            }
        });
    }
};
