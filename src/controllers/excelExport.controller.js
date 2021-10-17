const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    excelExportService,
} = require('../services/excelExport.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const excelExportController = async (req, res, next) => {
    const result = await excelExportService(req, res);
};

module.exports = {
    excelExportController,
}
