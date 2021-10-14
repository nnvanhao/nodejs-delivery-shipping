const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    createOrdersService,
} = require('../services/orders.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const createOrdersController = async (req, res, next) => {
    const result = await createOrdersService(req);
    sendResponse(result, RESOURCES.USER, HttpStatus.CREATED, req, res, next);
};

module.exports = {
    createOrdersController,
}
