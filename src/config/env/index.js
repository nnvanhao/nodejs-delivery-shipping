const env = process.env.NODE_ENV || 'development';
const config = Object.assign({ env: env }, require('./development.config'), require(`./${env}.config`));

module.exports = config;