const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");
const { ROLE_TYPE, USER_CODE, USER_STATUS } = require("../constants/common.constant");
const { getQueryConditionsForGetUsers, generateUserCode } = require("../helpers/common.helper");
const { decodeToken, getToken } = require("../helpers/token.helper");
const config = require("../config/env");
const { activeUserTemplate, sendEmail } = require("../helpers/mailer.helper");
const { generatePassword, hashPassword } = require("../helpers/password.helper");

const { User, UserBank, RoleType, UserRole, Customer, CustomerType, sequelize } = db;

const getUsersService = async (req) => {
    try {
        const { query } = req;
        const { page, pageSize, roleType, customerType } = query || {};
        const hasCustomerType = customerType ? true : false;
        const offset = (parseInt(page) - 1) * pageSize || undefined;
        const limit = parseInt(pageSize) || undefined;
        const conditions = getQueryConditionsForGetUsers(query, ['fullName', 'email', 'phoneNumber', 'code'])
        const { count, rows } = await User.findAndCountAll({
            where: {
                ...conditions,
                isDeleted: false
            },
            include: [
                {
                    model: UserRole,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: RoleType,
                            attributes: ['name'],
                            where: roleType && {
                                name: roleType
                            }
                        }
                    ]
                },
                {
                    model: Customer,
                    attributes: ['id'],
                    required: hasCustomerType,
                    include: [
                        {
                            model: CustomerType,
                            attributes: ['name'],
                            where: customerType && {
                                name: [customerType]
                            }
                        }
                    ]
                }
            ],
            attributes: { exclude: ['password'] },
            offset,
            limit,
            order: [
                ['createdAt', 'DESC']
            ],
        });
        return {
            items: rows,
            total: count
        };
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getUserByIdService = async (req) => {
    try {
        const { params } = req;
        const { id: userId } = params || {};
        const userInfo = await User.findOne({
            where: {
                id: userId
            },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserBank,
                    attributes: ['id', 'userId', 'number', 'holderName', 'branchName', 'isDefault']
                }
            ],
        });
        return userInfo;
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const updateUserService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { params, body } = req;
            const {
                userBanks = [],
                email,
                phoneNumber,
                gender,
                address,
                birthday,
                emergencyPhone,
                fullName,
                provinceId,
                districtId,
                wardId
            } = body;
            const { id: userId } = params || {};
            let errors = [];
            const bodyForUpdate = {
                email,
                phoneNumber,
                gender,
                address,
                birthday,
                emergencyPhone,
                fullName,
                provinceId,
                districtId,
                wardId
            }
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { phoneNumber }, { emergencyPhone }],
                    id: {
                        [Op.ne]: userId
                    }
                }, raw: true
            });
            if (user) {
                let message = {};
                if (user.email === email) {
                    message = Message.EMAIL_ADDRESS_ALREADY_EXISTS;
                } else if (user.phoneNumber === phoneNumber) {
                    message = Message.PHONE_NUMBER_ALREADY_EXISTS;
                } else if (user.emergencyPhone === emergencyPhone) {
                    message = Message.EMERGENCY_PHONE_ALREADY_EXISTS;
                }
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, message, {});
            }
            if (userBanks && userBanks.length) {
                const banksOfUserBody = [...userBanks].map(bank => {
                    return {
                        ...bank,
                        userId
                    }
                });
                const banksOfUser = await UserBank.findAll({ where: { userId }, raw: true });
                banksOfUser.forEach(bank => {
                    const { number: numberBank, id: bankId } = bank;
                    banksOfUserBody.forEach(bankBody => {
                        const { number: numberBody = '', id: bankBodyId = '' } = bankBody || {};
                        if (numberBank === numberBody && bankId !== bankBodyId) {
                            errors.push(bankBody);
                        }
                    });
                });
                if (errors.length) {
                    let extractedErrors = [];
                    errors.forEach(err => {
                        extractedErrors.push({
                            param: err.holderName,
                            msg: Message.BANK_NUMBER_IS_EXIST
                        })
                    });
                    return buildErrorItem(RESOURCES.USER, null, HttpStatus.NOT_ACCEPTABLE, Message.DATA_IS_EXIST, extractedErrors);
                }
                for (let i = 0; i < banksOfUserBody.length; i++) {
                    const data = banksOfUserBody[i] || {};
                    const { id } = data;
                    if (id) {
                        await UserBank.update(data, { where: { id } }, { transaction: t });
                    } else {
                        await UserBank.create(data, { transaction: t });
                    }
                }
            }
            const userInfo = await User.findOne({
                where: {
                    id: userId
                },
                attributes: { exclude: ['password'] },
            });
            await userInfo.update(bodyForUpdate, { transaction: t });
            return userInfo;
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const deleteUserService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { params } = req;
            const { id: userId } = params || {};
            await User.update({ isDeleted: true }, { where: { id: userId } }, { transaction: t });
            return {};
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const createUserService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { body,  headers: { host } = {} } = req;
            const {
                email,
                phoneNumber,
                roleType = ROLE_TYPE.EMPLOYEE,
                gender,
                address,
                birthday,
                emergencyPhone,
                fullName,
                provinceId,
                districtId,
                wardId
            } = body;
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { phoneNumber }]
                },
                raw: true,
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
                            [Op.like]: '%' + USER_CODE.NV + '%'
                        }
                    },
                    raw: true,
                });
                const roleTypeInfo = await RoleType.findOne({ where: { name: roleType }, raw: true });
                const code = generateUserCode(lastUser, USER_CODE.NV);
                const getPasswordGenerate = generatePassword();
                const userInfo = {
                    email,
                    phoneNumber,
                    gender,
                    address,
                    birthday,
                    emergencyPhone,
                    fullName,
                    provinceId,
                    districtId,
                    wardId,
                    code,
                    password: hashPassword(getPasswordGenerate)
                };
                const userCreate = (await User.create(userInfo, { transaction: t })).get({ plain: true });
                const { id: userId } = userCreate;
                const { id: roleTypeId } = roleTypeInfo;
                await UserRole.create({ userId, roleTypeId }, { transaction: t });
                // send email activate
                const token = getToken(email, userId);
                const { subject, htmlBody } = activeUserTemplate(fullName, token, host, getPasswordGenerate);
                const info = await sendEmail(undefined, email, subject, null, htmlBody);
                if (!info) {
                    await t.rollback();
                    return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, Message.SEND_EMAIL_ACTIVE_FAIL, {});
                }
                delete userInfo.password;
                return userInfo;
            }
        })
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const activateUserService = async (req, res) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { query } = req;
            const { token } = query || {};
            const { userId } = decodeToken(token);
            const userInfo = await User.findOne({
                where: {
                    id: userId
                },
                attributes: { exclude: ['password'] },
            });
            const userInfoFormat = userInfo.get({ plain: true });
            const { status } = userInfoFormat;
            if (status === USER_STATUS.ACTIVE) {
                res.redirect(`${config.METHOD}${config.HOST}/login?hasActive=${true}`);
                return {};
            }
            await userInfo.update({
                status: USER_STATUS.ACTIVE
            }, { transaction: t });
            res.redirect(`${config.METHOD}${config.HOST}/login?hasActive=${true}`);
            return {};
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    createUserService,
    activateUserService
};
