const {
    getToken,
    getRefreshToken,
    decodeToken,
    getTokenString
} = require("../helpers/token.helper");
const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");
const { ROLE_TYPE } = require("../constants/common.constant");

const { User, UserToken, RoleType, UserRole, sequelize } = db;

const signInService = async (email, password) => {
    try {
        return await sequelize.transaction(async (t) => {
            const user = await User.findOne({ where: { email, isDeleted: false }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true });
            if (!user) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_NOT_EXIST, {});
            } else if (user.password !== password) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.PASSWORD_IS_INCORRECT, {});
            }
            const userId = user.id;
            const token = getToken(email, userId);
            const userTokenData = {
                userId,
                token
            }
            const tokenInfo = await UserToken.findOne({ where: { [Op.and]: [{ userId }, { isExpired: false }] } });
            if (tokenInfo) {
                tokenInfo.isExpired = true;
                await tokenInfo.save({ transaction: t });
            }
            await UserToken.create(userTokenData, { transaction: t });
            // const refreshToken = getRefreshToken(user.id);
            delete user.password;
            const signInData = {
                token,
                ...user
                // refreshToken,
            };
            return signInData;
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
};

const signUpService = async (data) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { email, password, phoneNumber } = data;
            const userInfo = {
                ...data,
                password,
            };
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
                const RoleTypeInfo = await RoleType.findOne({ where: { name: ROLE_TYPE.PARTNER }, raw: true });
                const userCreate = (await User.create(userInfo, { transaction: t })).get({ plain: true });
                const { id: userId } = userCreate;
                const { id: roleTypeId } = RoleTypeInfo;
                await UserRole.create({ userId, roleTypeId }, { transaction: t });
                const signUpData = {
                    email,
                    phoneNumber
                };
                return signUpData;
            }
        })
    } catch (error) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
};

const signOutService = async (token) => {
    try {
        const tokenFormat = getTokenString(token);
        const { userId } = decodeToken(tokenFormat);
        const tokenInfo = await UserToken.findOne({ where: { [Op.and]: [{ userId }, { isExpired: false }] } });
        if (tokenInfo) {
            tokenInfo.isExpired = true;
            await tokenInfo.save();
        }
        return {};
    } catch (error) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    signInService,
    signUpService,
    signOutService
};