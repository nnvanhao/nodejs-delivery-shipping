const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    uploadFilesService,
} = require('../services/uploadFile.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const uploadFilesController = async (req, res, next) => {
    const result = await uploadFilesService(req, res);
    sendResponse(result, RESOURCES.UPLOAD_FILE, HttpStatus.OK, req, res, next);
};

module.exports = {
    uploadFilesController,
}
