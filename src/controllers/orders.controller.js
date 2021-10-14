const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    createOrdersService,
    getOrdersService,
    getOrdersByIdService,
    updateOrdersService
} = require('../services/orders.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const createOrdersController = async (req, res, next) => {
    const result = await createOrdersService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.CREATED, req, res, next);
};

const getOrdersController = async (req, res, next) => {
    const result = await getOrdersService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.OK, req, res, next);
};

const getOrdersByIdController = async (req, res, next) => {
    const result = await getOrdersByIdService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.OK, req, res, next);
};

const updateOrdersController = async (req, res, next) => {
    const result = await updateOrdersService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.OK, req, res, next);
};

module.exports = {
    createOrdersController,
    getOrdersController,
    getOrdersByIdController,
    updateOrdersController
}
