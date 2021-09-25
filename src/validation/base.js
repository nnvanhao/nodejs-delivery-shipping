const HttpStatus = require('http-status-codes');
const { matchedData, validationResult } = require('express-validator');
const { buildErrorItem, sendErrorResponse } = require('../helpers/error.helper');
const Message = require('../constants/message.constant');

const validateResult = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    const errorJsonString = JSON.stringify(extractedErrors);

    const errorItem = buildErrorItem(validateResult.name, null, HttpStatus.UNPROCESSABLE_ENTITY, Message.INVALID_VALIDATE_FIELD, extractedErrors);
    sendErrorResponse(errorItem, req, res, next, errorJsonString);
}

module.exports = {
    validateResult,
};