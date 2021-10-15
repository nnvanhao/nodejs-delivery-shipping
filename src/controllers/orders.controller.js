const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    createOrdersService,
    getOrdersService,
    getOrdersByIdService,
    updateOrdersService,
    deleteOrdersService,
    createOrdersEventService,
    getOrdersEventsService
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

const deleteOrdersController = async (req, res, next) => {
    const result = await deleteOrdersService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.OK, req, res, next);
};

const createOrdersEventController = async (req, res, next) => {
    const result = await createOrdersEventService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.OK, req, res, next);
};

const getOrdersEventController = async (req, res, next) => {
    const result = await getOrdersEventsService(req);
    sendResponse(result, RESOURCES.ORDERS, HttpStatus.OK, req, res, next);
};

module.exports = {
    createOrdersController,
    getOrdersController,
    getOrdersByIdController,
    updateOrdersController,
    deleteOrdersController,
    createOrdersEventController,
    getOrdersEventController
}
