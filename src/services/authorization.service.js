const {
    getToken,
    getRefreshToken,
} = require("../helpers/token.helper");
const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");

const { User } = db;

const signInService = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true });
        if (!user) {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_NOT_EXIST, {});
        } else if (user.password !== password) {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.PASSWORD_IS_INCORRECT, {});
        }
        const token = getToken(email, user.id);
        // const refreshToken = getRefreshToken(user.id);
        delete user.password;
        const signInData = {
            token,
            ...user
            // refreshToken,
        };
        return signInData;
    } catch (error) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
};

const signUpService = async (data) => {
    const { email, password, phoneNumber } = data;
    const userInfo = {
        ...data,
        password,
    };
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }, raw: true
        });
        if (user) {
            let message = {};
            if (user.email === email) {
                message = Message.EMAIL_ADDRESS_ALREADY_EXISTS;
            } else if (user.phoneNumber === phoneNumber) {
                message = Message.PHONE_NUMBER_ALREADY_EXISTS;
            }
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, message, {});
        } else {
            await User.create(userInfo);
            const signUpData = {
                email,
                phoneNumber
            };
            return signUpData;
        }
    } catch (error) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
};

module.exports = {
    signInService,
    signUpService
};