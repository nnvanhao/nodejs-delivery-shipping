const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    getUsersService,
    getUserByIdService
} = require('../services/user.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const getUsersController = async (req, res, next) => {
    const result = await getUsersService(req);
    sendResponse(result, RESOURCES.USER, HttpStatus.OK, req, res, next);
};

const getUserByIdController = async (req, res, next) => {
    const result = await getUserByIdService(req);
    sendResponse(result, RESOURCES.USER, HttpStatus.OK, req, res, next);
};

module.exports = {
    getUsersController,
    getUserByIdController,
}
