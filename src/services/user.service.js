const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");
const { ROLE_TYPE, USER_CODE } = require("../constants/common.constant");
const { getQueryConditionsForGetUsers, generateUserCode } = require("../helpers/common.helper");

const { User, UserBank, RoleType, UserRole, sequelize } = db;

const getUsersService = async (req) => {
    try {
        const { query } = req;
        const { page, pageSize, roleType = [ROLE_TYPE.CUSTOMER] } = query || {};
        const offset = (parseInt(page) - 1) || undefined;
        const limit = parseInt(pageSize) || undefined;
        const conditions = getQueryConditionsForGetUsers(query, ['fullName', 'email', 'phoneNumber'])
        const { count, rows } = await User.findAndCountAll({
            where: {
                ...conditions,
                isDeleted: false
            },
            include:
            {
                model: UserRole,
                attributes: ['id'],
                required: true,
                include: [
                    {
                        model: RoleType,
                        attributes: ['name'],
                        where: {
                            name: [roleType]
                        }
                    }
                ]
            }
            ,
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
            const { userBanks } = body;
            const { id: userId } = params || {};
            let errors = [];
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
            const userInfo = await User.findOne({
                where: {
                    id: userId
                },
                attributes: { exclude: ['password'] },
            });
            await userInfo.update({
                ...body
            }, { transaction: t });
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
            const { body } = req;
            const { email, phoneNumber, roleType = ROLE_TYPE.EMPLOYEE } = body;
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
                const userInfo = {
                    ...body,
                    code
                };
                const userCreate = (await User.create(userInfo, { transaction: t })).get({ plain: true });
                const { id: userId } = userCreate;
                const { id: roleTypeId } = roleTypeInfo;
                await UserRole.create({ userId, roleTypeId }, { transaction: t });
                return userInfo;
            }
        })
    } catch (error) {
        console.log({error});
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    createUserService
};
