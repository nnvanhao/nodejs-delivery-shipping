const responseSerializer = require('../helpers/responseSerializer.helper');
const { buildErrorItem, sendErrorResponse } = require('../helpers/error.helper');
const HttpStatus = require('http-status-codes');
const Message = require('../constants/message.constant');

const sendResponse = (results, resources, httpStatusCode, req, res, next) => {
    try {
        if (!results['resource']) {
            const { items, total } = results || {};
            const resultsSelected = items ? items : results;
            const response = responseSerializer.formatResponse(resultsSelected, resources, total);
            res.status(httpStatusCode).send(response);
        } else {
            sendErrorResponse(results, req, res, next);
        }
    } catch (err) {
        const errorItem = buildErrorItem(
            this.sendResponse.name,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR,
            Message.INTERNAL_SERVER_ERROR,
            err.message
        );
        sendErrorResponse(errorItem, req, res, next, err);
    }
}

module.exports = {
    sendResponse
}
