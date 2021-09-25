const Sequelize = require("sequelize");
const config = require('../../config/env');
const { LOGGER_TYPE } = require('../../constants/common.constant');
const Logger = require('../../../src/helpers/logger.helper');
const logger = new Logger();
let sequelizeInstance = null;

// Singleton Pattern
class MySQLConnection {
    constructor() {
        this.sequelize = this.initConnect();
    }

    static getSequelizeInstance = () => {
        if (!sequelizeInstance) {
            sequelizeInstance = new MySQLConnection();
        }

        return sequelizeInstance;
    }

    initConnect = () => {
        return new Sequelize(
            config.DATABASE.MYSQL_DATABASE,
            config.DATABASE.USERNAME,
            config.DATABASE.PASSWORD, {
            host: config.DATABASE.MYSQL_HOST,
            dialect: "mysql",
            define: {
                timestamps: false
            },
            logging: false,
        });
    }

    getConnection = () => {
        return this.sequelize;
    }

    getConnectStatus = async () => {
        try {
            await this.sequelize.authenticate();
        } catch (error) {
            logger.log(`MySQL connect unsuccessful, retry after 5 seconds at: ${new Date()}`, LOGGER_TYPE.ERROR);
            ++count;
            setTimeout(await this.getConnectStatus(), 5000);
        }
    }
}

module.exports = MySQLConnection;
