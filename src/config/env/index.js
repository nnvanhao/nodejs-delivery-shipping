const env = process.env.NODE_ENV || 'dev';
const config = Object.assign({ env: env }, require('./dev.config'), require(`./${env}.config`));

module.exports = config;