const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");

const { Province, District, Ward } = db;

const getProvincesService = async () => {
    try {
        const provinces = await Province.findAll();
        return provinces
    } catch (error) {
        console.log({error});
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getDistrictsByProvinceService = async (req) => {
    try {
        const { params } = req;
        const { id } = params || {};
        const districts = await District.findAll({ where: { provinceId: id } });
        return districts
    } catch (error) {
        console.log({error});
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getWardsByDistrictService = async (req) => {
    try {
        const { params } = req;
        const { id } = params || {};
        const wards = await Ward.findAll({ where: { districtId: id }, raw: true });
        return wards
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    getProvincesService,
    getDistrictsByProvinceService,
    getWardsByDistrictService
};
