const crypto = require('crypto');
const config = require('../config/env');
const jwt = require('jsonwebtoken');
const Message = require('../constants/message.constant');
const { buildErrorItem, sendErrorResponse } = require('../helpers/error.helper');
const HttpStatus = require('http-status-codes');
const db = require("../models/index");
const { getTokenString, decodeToken } = require('../helpers/token.helper');

const { UserToken } = db;

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email || !req.body.password) {
            errors.push(Message.MISSING_EMAIL_PASSWORD_FIELDS);
        }

        if (errors.length) {
            const errorItem = buildErrorItem('hasAuthValidFields', null, HttpStatus.BAD_REQUEST, errors, null);
            sendErrorResponse(errorItem, req, res, next);
        } else {
            return next();
        }
    }
};

exports.hasRegistryUserValidFields = async (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push(Message.MISSING_EMAIL_FIELDS);
        }
        if (!req.body.password) {
            errors.push(Message.MISSING_PASSWORD_FIELDS);
        }

        if (errors.length) {
            const errorItem = buildErrorItem('hasRegistryUserValidFields', null, HttpStatus.BAD_REQUEST, errors, null);
            sendErrorResponse(errorItem, req, res, next);
        } else {
            return next();
        }
    }
};

exports.verifyRefreshBodyField = (req, res, next) => {
    if (!req.body || !req.body.refreshToken) {
        const errorItem = buildErrorItem('verifyRefreshBodyField', null, HttpStatus.BAD_REQUEST, Message.REFRESH_TOKEN_FIELD, null);
        sendErrorResponse(errorItem, req, res, next);
    } else {
        return next();
    }
};

exports.validJWTNeeded = async (req, res, next) => {
    let message = '';
    if (req.headers['authorization']) {
        try {
            const token = getTokenString(req.headers['authorization']);
            const tokenInfo = await UserToken.findOne({ where: { token } });
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                message = Message.UNAUTHORIZED;
            } else if (tokenInfo.isExpired) {
                message = Message.TOKEN_EXPIRED;
            } else {
                req.jwt = jwt.verify(authorization[1], config.JWT_SECRET);
                return next();
            }
        } catch (err) {
            message = Message.TOKEN_EXPIRED;
        }
    } else {
        message = Message.UNAUTHORIZED;
    }
    const errorItem = buildErrorItem('validJWTNeeded', null, HttpStatus.UNAUTHORIZED, message, null);
    sendErrorResponse(errorItem, req, res, next);
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = new Buffer(req.body.refreshToken, 'base64');
    let refreshToken = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + config.JWT_SECRET).digest("base64");
    if (hash === refreshToken) {
        req.body = req.jwt;
        return next();
    } else {
        const errorItem = buildErrorItem('validRefreshNeeded', null, HttpStatus.UNAUTHORIZED, Message.UNAUTHORIZED, null);
        sendErrorResponse(errorItem, req, res, next);
    }
};

exports.verifyTokenForGetRequest = async (req, res, next) => {
    const { query } = req;
    const { token } = query || {};
    let message = '';
    try {
        if (!token) {
            message = Message.UNAUTHORIZED;
        } else {
            jwt.verify(token, config.JWT_SECRET);
            return next();
        }
    } catch (error) {
        message = Message.TOKEN_EXPIRED;
    }
    const errorItem = buildErrorItem('validJWTNeeded', null, HttpStatus.UNAUTHORIZED, message, null);
    sendErrorResponse(errorItem, req, res, next);
};
