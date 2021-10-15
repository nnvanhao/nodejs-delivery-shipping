const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    createOrdersService,
    getOrdersService,
    getOrdersByIdService,
    updateOrdersService,
    deleteOrdersService,
    createOrdersEventService,
    getOrdersEventsService,
    getOrdersStatusesService,
    createOrdersStatusService,
    updateOrdersStatusService,
    updateSortIndexOrdersStatusService
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

const getOrdersStatusesController = async (req, res, next) => {
    const result = await getOrdersStatusesService();
    sendResponse(result, RESOURCES.ORDERS_STATUS, HttpStatus.OK, req, res, next);
};

const createOrdersStatusController = async (req, res, next) => {
    const result = await createOrdersStatusService(req);
    sendResponse(result, RESOURCES.ORDERS_STATUS, HttpStatus.OK, req, res, next);
};

const updateOrdersStatusController = async (req, res, next) => {
    const result = await updateOrdersStatusService(req);
    sendResponse(result, RESOURCES.ORDERS_STATUS, HttpStatus.OK, req, res, next);
};

const updateSortIndexOrdersStatusController = async (req, res, next) => {
    const result = await updateSortIndexOrdersStatusService(req);
    sendResponse(result, RESOURCES.ORDERS_STATUS, HttpStatus.OK, req, res, next);
};

module.exports = {
    createOrdersController,
    getOrdersController,
    getOrdersByIdController,
    updateOrdersController,
    deleteOrdersController,
    createOrdersEventController,
    getOrdersEventController,
    getOrdersStatusesController,
    createOrdersStatusController,
    updateOrdersStatusController,
    updateSortIndexOrdersStatusController
}
