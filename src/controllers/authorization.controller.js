const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    signInService,
    signUpService
} = require('../services/authorization.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const signInController = (req, res, next) => {
    const { email, password } = req.body;
    const result = signInService(email, password);
    sendResponse(result, RESOURCES.AUTHORIZATION, HttpStatus.OK, req, res, next);
};

const signUpController = (req, res, next) => {
    const data = {...req.body};
    const result = signUpService(data);
    sendResponse(result, RESOURCES.AUTHORIZATION, HttpStatus.CREATED, req, res, next);
};

const signOutController = (req, res, next) => {
    sendResponse(null, RESOURCES.AUTHORIZATION, HttpStatus.NO_CONTENT, req, res, next);
};

module.exports = {
    signInController,
    signUpController,
    signOutController
}