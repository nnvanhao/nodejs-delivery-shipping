const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    updateSettingsService,
    getSettingsService,
    getSettingByKeyService
} = require('../services/setting.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const updateSettingsController = async (req, res, next) => {
    const result = await updateSettingsService(req, res);
    sendResponse(result, RESOURCES.SETTINGS, HttpStatus.OK, req, res, next);
};

const getSettingsController = async (req, res, next) => {
    const result = await getSettingsService(req, res);
    sendResponse(result, RESOURCES.SETTINGS, HttpStatus.OK, req, res, next);
};

const getSettingByKeyController = async (req, res, next) => {
    const result = await getSettingByKeyService(req, res);
    sendResponse(result, RESOURCES.SETTINGS, HttpStatus.OK, req, res, next);
};


module.exports = {
    updateSettingsController,
    getSettingsController,
    getSettingByKeyController
}
