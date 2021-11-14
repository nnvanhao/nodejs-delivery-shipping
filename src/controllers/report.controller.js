const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    employeeReportService,
    customerReportService
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

module.exports = {
    employeeReportController,
    customerReportController
}
