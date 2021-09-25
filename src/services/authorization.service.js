const {
    getToken,
    getRefreshToken
} = require("../helpers/token.helper");
const { buildErrorItem } = require('../helpers/error.helper');
const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { RESOURCES } = require("../constants/baseApiResource.constant");

const signInService = (email, password) => {
    const isTrue = true;
    const userId = '';

    if (!isTrue) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.BAD_REQUEST, Message.INTERNAL_SERVER_ERROR, {});
    }
    const token = getToken(email, password);
    const refreshToken = getRefreshToken(userId);

    const signInData = {
        token,
        refreshToken,
    };

    return signInData;
};

const signUpService = (data) => {
    const { email, password, firstName, lastName } = data;
    const isTrue = true;
    const userId = '';

    const userInfo = {
        firstName,
        lastName,
        email,
    };

    if (isTrue) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.BAD_REQUEST, Message.INTERNAL_SERVER_ERROR, {});
    }
    const token = getToken(email, password);
    const refreshToken = getRefreshToken(userId);

    const signUpData = {
        token,
        refreshToken,
        userInfo,
    };

    return signUpData;
};

module.exports = {
    signInService,
    signUpService
};