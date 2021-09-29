const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    signInService,
    signUpService,
    signOutService
} = require('../services/authorization.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const signInController = async (req, res, next) => {
    const { email, password } = req.body;
    const result = await signInService(email, password);
    sendResponse(result, RESOURCES.AUTHORIZATION, HttpStatus.OK, req, res, next);
};

const signUpController = async (req, res, next) => {
    const data = {...req.body};
    const result = await signUpService(data);
    sendResponse(result, RESOURCES.AUTHORIZATION, HttpStatus.CREATED, req, res, next);
};

const signOutController = async (req, res, next) => {
    const result = await signOutService(req.headers.authorization);
    sendResponse(result, RESOURCES.AUTHORIZATION, HttpStatus.NO_CONTENT, req, res, next);
};

module.exports = {
    signInController,
    signUpController,
    signOutController
}
