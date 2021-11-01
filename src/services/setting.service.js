const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const { findFolderByName, createFolder, createFile } = require('../helpers/googleDriver.helper');
const { isEmpty } = require("../helpers/common.helper");
const { FOLDER_DRIVER_NAME } = require("../constants/common.constant");
const db = require("../models/index");

const {
    Settings,
    ResourceFiles,
    sequelize
} = db;

const updateSettingsService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { body } = req;
            const { key, value } = body;
            await Settings.update({ value }, { where: { key } }, { transaction: t });
            return {};
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.SETTINGS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getSettingsService = async (req) => {
    try {
        const { query } = req;
        const { key } = query;
        let conditions = {};
        if (key) {
            conditions = {
                key
            }
        }
        const settingsResult = await Settings.findAll({
            where: {
                ...conditions
            },
            raw: true,
            nest: true
        });
        return settingsResult;
    } catch (error) {
        return buildErrorItem(RESOURCES.SETTINGS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getSettingByKeyService = async (req) => {
    try {
        const { query } = req;
        const { key } = query;
        const settingResult = await Settings.findOne({
            where: {
                key
            },
            raw: true,
            nest: true
        });
        return settingResult;
    } catch (error) {
        return buildErrorItem(RESOURCES.SETTINGS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    updateSettingsService,
    getSettingsService,
    getSettingByKeyService
};
