const Message = require('../../common/constants/message');
const { buildErrorItem } = require('../../helpers/error.helper');
const { sendErrorResponse } = require('../../core/base/error.base');
const HttpStatus = require('http-status-codes');

exports.permissionRequired = (accessRight) => {
    return async (req, res, next) => {
        let userId = req.jwt.userId;

        const isHasPermission = true;
        if (isHasPermission) {
            return next();
        } else {
            const errorItem = buildErrorItem('permissionRequired', null, HttpStatus.FORBIDDEN, Message.NO_PERMISSION, null);
            sendErrorResponse(errorItem, req, res, next);
        }
    };
};

