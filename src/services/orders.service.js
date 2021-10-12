const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");

const { Orders, sequelize  } = db;

const createOrdersService = async (req) => {
    return await sequelize.transaction(async (t) => {
        const { body } = req;
    })
}

module.exports = {
    createOrdersService,
};
