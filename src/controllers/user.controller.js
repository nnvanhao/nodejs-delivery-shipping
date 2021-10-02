const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
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

const updateUserController = async (req, res, next) => {
    const result = await updateUserService(req);
    sendResponse(result, RESOURCES.USER, HttpStatus.OK, req, res, next);
};

const deleteUserController = async (req, res, next) => {
    const result = await deleteUserService(req);
    sendResponse(result, RESOURCES.USER, HttpStatus.OK, req, res, next);
};

module.exports = {
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController
}
