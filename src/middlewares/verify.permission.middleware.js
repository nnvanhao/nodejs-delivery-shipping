const Message = require('../constants/message.constant');
const { buildErrorItem, sendErrorResponse } = require('../helpers/error.helper');
const HttpStatus = require('http-status-codes');
const db = require("../models/index");

const { UserRole, RoleType } = db;

exports.permissionRequired = (accessRoles) => {
    return async (req, res, next) => {
        const userId = req.jwt.userId;
        const userAccessRole = await this.getUserAccessRole(userId);
        const isHasPermission = accessRoles.includes(userAccessRole);
        if (!accessRoles || isHasPermission) {
            return next();
        } else {
            const errorItem = buildErrorItem('permissionRequired', null, HttpStatus.FORBIDDEN, Message.NO_PERMISSION, null);
            sendErrorResponse(errorItem, req, res, next);
        }
    }
};

exports.getUserAccessRole = async (userId) => {
    try {
        const userRoleInfo = await UserRole.findOne({ where: { userId }, raw: true });
        const { roleTypeId } = userRoleInfo;
        const roleTypeInfo = await RoleType.findOne({ where: { id: roleTypeId }, raw: true });
        const { name } = roleTypeInfo;
        return name;
    } catch (error) {
        const errorItem = buildErrorItem('permissionRequired', null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, null);
        sendErrorResponse(errorItem, req, res, next);
    }
};

