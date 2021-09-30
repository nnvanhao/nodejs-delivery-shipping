const HttpStatus = require("http-status-codes");
const { sendResponse } = require("./base.controller");
const {
    getProvincesService,
    getDistrictsByProvinceService,
    getWardsByDistrictService
} = require('../services/address.service');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const getProvincesController = async (req, res, next) => {
    const result = await getProvincesService();
    sendResponse(result, RESOURCES.ADDRESS, HttpStatus.OK, req, res, next);
};

const getDistrictsByProvinceController = async (req, res, next) => {
    const result = await getDistrictsByProvinceService(req);
    sendResponse(result, RESOURCES.ADDRESS, HttpStatus.OK, req, res, next);
};

const getWardsByDistrictController = async (req, res, next) => {
    const result = await getWardsByDistrictService(req);
    sendResponse(result, RESOURCES.ADDRESS, HttpStatus.OK, req, res, next);
};

module.exports = {
    getProvincesController,
    getDistrictsByProvinceController,
    getWardsByDistrictController
}
