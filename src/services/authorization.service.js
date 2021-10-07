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
const { ROLE_TYPE, CUSTOMER_TYPE, USER_CODE, USER_STATUS } = require("../constants/common.constant");
const { generateUserCode } = require("../helpers/common.helper");
const { sendEmail, activeUserTemplate, forgotPasswordTemplate } = require("../helpers/mailer.helper");

const { User, UserToken, RoleType, UserRole, CustomerType, Customer, sequelize } = db;

const signInService = async (email, password) => {
    try {
        return await sequelize.transaction(async (t) => {
            const user = await User.findOne({ where: { email, isDeleted: false }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true });
            const { status } = user || {};
            if (!user) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_NOT_EXIST, {});
            } else if (user.password !== password) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.PASSWORD_IS_INCORRECT, {});
            } else if (status === USER_STATUS.WAITING_VERIFY) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_WAITING_ACTIVE, {});
            } else if (status === USER_STATUS.INACTIVE) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_INACTIVE, {});
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

const signUpService = async (data, req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { email, password, phoneNumber, roleType = ROLE_TYPE.CUSTOMER, customerType = CUSTOMER_TYPE.OTHER } = data;
            const { headers: { host } = {} } = req;
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
                const lastUser = await User.findOne({
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    where: {
                        code: {
                            [Op.like]: '%' + USER_CODE.KH + '%'
                        }
                    },
                    raw: true
                });
                const roleTypeInfo = await RoleType.findOne({ where: { name: roleType }, raw: true });
                const customerTypeInfo = await CustomerType.findOne({ where: { name: customerType }, raw: true });
                const code = generateUserCode(lastUser, USER_CODE.KH);
                const userInfo = {
                    email,
                    password,
                    phoneNumber,
                    code
                };
                const userCreate = (await User.create(userInfo, { transaction: t })).get({ plain: true });
                const { id: userId } = userCreate;
                const { id: roleTypeId } = roleTypeInfo;
                const { id: customerTypeId } = customerTypeInfo;
                await UserRole.create({ userId, roleTypeId }, { transaction: t });
                await Customer.create({ userId, customerTypeId }, { transaction: t });
                // send email activate
                const token = getToken(email, userId);
                const { subject, htmlBody } = activeUserTemplate(null, token, host);
                const info = await sendEmail(undefined, email, subject, null, htmlBody);
                if (!info) {
                    await t.rollback();
                    return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, Message.SEND_EMAIL_ACTIVE_FAIL, {});
                }
                const signUpData = {
                    email,
                    phoneNumber,
                    code
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

const forgotPasswordService = async (req) => {
    try {
        const { body, headers: { host } = {} } = req;
        const { email } = body;
        const user = await User.findOne({ where: { email, isDeleted: false }, attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true });
        const { status, id: userId, fullName } = user || {};
        if (!user) {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.EMAIL_NOT_EXIST, {});
        } else if (status === USER_STATUS.WAITING_VERIFY) {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_WAITING_ACTIVE, {});
        } else if (status === USER_STATUS.INACTIVE) {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message.USER_IS_INACTIVE, {});
        }
        // send email forgot password
        const token = getToken(email, userId);
        const { subject, htmlBody } = forgotPasswordTemplate(fullName, token, host);
        const info = await sendEmail(undefined, email, subject, null, htmlBody);
        if (!info) {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, Message.SEND_EMAIL_ACTIVE_FAIL, {});
        }
        return {};
    } catch (error) {
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const resetPasswordService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { body } = req;
            const { password, token } = body;
            const { userId } = decodeToken(token);
            const user = await User.findOne({ where: { id: userId } });
            if (user) {
                user.password = password;
                await user.save({ transaction: t });
            }
            return {};
        });
    } catch (error) {
        const { name } = JSON.parse(JSON.stringify(error)) || {};
        if (name === 'TokenExpiredError' || name === 'JsonWebTokenError') {
            return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.UNAUTHORIZED, Message[name], {});
        }
        return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    signInService,
    signUpService,
    signOutService,
    forgotPasswordService,
    resetPasswordService
};
