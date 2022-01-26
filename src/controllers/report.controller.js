const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    employeeReportService,
    customerReportService,
    ordersReportService,
    totalReportService
} = require('../services/report.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const employeeReportController = async (req, res, next) => {
    const result = await employeeReportService(req, res);
    sendResponse(result, RESOURCES.REPORTS, HttpStatus.OK, req, res, next);
};

const customerReportController = async (req, res, next) => {
    const result = await customerReportService(req, res);
    sendResponse(result, RESOURCES.REPORTS, HttpStatus.OK, req, res, next);
};

const ordersReportController = async (req, res, next) => {
    const result = await ordersReportService(req, res);
    sendResponse(result, RESOURCES.REPORTS, HttpStatus.OK, req, res, next);
};

const totalReportController = async (req, res, next) => {
    const result = await totalReportService(req, res);
    sendResponse(result, RESOURCES.REPORTS, HttpStatus.OK, req, res, next);
};

module.exports = {
    employeeReportController,
    customerReportController,
    ordersReportController,
    totalReportController
}
