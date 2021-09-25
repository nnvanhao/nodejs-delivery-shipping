const Logger = require('../helpers/logger.helper');
const logger = new Logger();
const RESOURCES = require('../constants/baseApiResource.constant');

const buildErrorItem = (resource, field, code, message, details) => {
    const errorItem = {
        resource,
        field,
        code,
        message,
        details,
        date: new Date(),
    };
    return errorItem;
}

const errorResponse = (err) => {
    return {
        error: getErrorItem(err.resource, err.field, err.code, err.message, err.details),
        meta: getErrorItemMeta(),
    };
}

const sendErrorResponse = (errorItem, req, res, next, error = null) => {
    logger.log(`Error during processing request: ${`${req.protocol}://${req.get('host')}${req.originalUrl}`} details message: ${error}`, 'error');
    try {
        const response = errorResponse(errorItem);
        res.status(errorItem.code).send(response);
    } catch (err) {
        const errorItem = buildErrorItem(this.sendResponse.name, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, err.message);
        sendErrorResponse(errorItem, req, res, next, err);
    }
}

const getErrorItem = (resource, field, code, message, details) => {
    return {
        resource: resource,
        field: field,
        code: code,
        message: message,
        details: details,
        date: new Date()
    };
}

const getErrorItemMeta = () => {
    return {
        type: RESOURCES.ERROR
    };
}

module.exports = {
    buildErrorItem,
    sendErrorResponse
};