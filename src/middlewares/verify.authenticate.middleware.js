const crypto = require('crypto');
const config = require('../config/env');
const jwt = require('jsonwebtoken');
const Message = require('../constants/message.constant');
const { buildErrorItem, sendErrorResponse } = require('../helpers/error.helper');
const HttpStatus = require('http-status-codes');

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

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                const errorItem = buildErrorItem('validJWTNeeded', null, HttpStatus.UNAUTHORIZED, Message.UNAUTHORIZED, null);
                sendErrorResponse(errorItem, req, res, next);
            } else {
                req.jwt = jwt.verify(authorization[1], config.JWT_SECRET);
                return next();
            }

        } catch (err) {
            const errorItem = buildErrorItem('validJWTNeeded', null, HttpStatus.FORBIDDEN, Message.FORBIDDEN, null);
            sendErrorResponse(errorItem, req, res, next);
        }
    } else {
        const errorItem = buildErrorItem('validJWTNeeded', null, HttpStatus.UNAUTHORIZED, Message.UNAUTHORIZED, null);
        sendErrorResponse(errorItem, req, res, next);
    }
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
