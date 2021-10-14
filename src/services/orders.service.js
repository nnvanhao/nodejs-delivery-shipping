const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");
const { USER_CODE, ROLE_TYPE, CUSTOMER_TYPE, USER_STATUS } = require("../constants/common.constant");
const { generateUserCode } = require("../helpers/common.helper");
const { ordersTemplate, sendEmail } = require("../helpers/mailer.helper");

const {
    Orders,
    User,
    RoleType,
    CustomerType,
    UserRole,
    Customer,
    Province,
    District,
    Ward,
    sequelize
} = db;

const createOrdersService = async (req) => {
    try {
        const { body } = req;
        const { isPartner, pickupName, pickupPhone, email, pickupProvince, pickupDistrict, pickupWard, pickupAddress } = body;
        if (!isPartner) {
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { phoneNumber: pickupPhone }]
                }, raw: true
            });
            if (user) {
                let message = {};
                if (user.email === email) {
                    message = Message.EMAIL_ADDRESS_ALREADY_EXISTS;
                } else if (user.phoneNumber === pickupPhone) {
                    message = Message.PHONE_NUMBER_ALREADY_EXISTS;
                }
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, message, {});
            }
        }
        const lastOrders = await Orders.findOne({
            limit: 1,
            order: [['createdAt', 'DESC']],
            where: {
                code: {
                    [Op.like]: '%' + USER_CODE.ORDER + '%'
                }
            },
            raw: true,
        });
        const ordersCode = generateUserCode(lastOrders, USER_CODE.ORDER);
        await sequelize.transaction(async (t) => {
            if (!isPartner) {
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
                const roleTypeInfo = await RoleType.findOne({ where: { name: ROLE_TYPE.CUSTOMER }, raw: true });
                const customerTypeInfo = await CustomerType.findOne({ where: { name: CUSTOMER_TYPE.OTHER }, raw: true });
                const userCode = generateUserCode(lastUser, USER_CODE.KH);
                const userInfo = {
                    email,
                    phoneNumber: pickupPhone,
                    code: userCode,
                    fullName: pickupName,
                    provinceId: pickupProvince,
                    districtId: pickupDistrict,
                    wardId: pickupWard,
                    address: pickupAddress,
                    status: USER_STATUS.INACTIVE
                };
                const userCreate = (await User.create(userInfo, { transaction: t })).get({ plain: true });
                const { id: userId } = userCreate;
                const { id: roleTypeId } = roleTypeInfo;
                const { id: customerTypeId } = customerTypeInfo;
                await UserRole.create({ userId, roleTypeId }, { transaction: t });
                await Customer.create({ userId, customerTypeId }, { transaction: t });
                body.orderCreatorId = userId;
            }
            const ordersBody = {
                code: ordersCode,
                ...body
            }
            await Orders.create(ordersBody, { transaction: t });
        });
        if (!isPartner) {
            //send email orders info
            // const token = getToken(email, userId);
            const ordersInfo = await Orders.findOne({
                where: {
                    code: ordersCode
                },
                include: [
                    {
                        model: Province,
                        attributes: ['id', 'name'],
                        as: 'pickupProvinceInfo'
                    },
                    {
                        model: District,
                        attributes: ['id', 'name'],
                        as: 'pickupDistrictInfo'
                    },
                    {
                        model: Ward,
                        attributes: ['id', 'name'],
                        as: 'pickupWardInfo'
                    },
                    {
                        model: Province,
                        attributes: ['id', 'name'],
                        as: 'recipientProvinceInfo'
                    },
                    {
                        model: District,
                        attributes: ['id', 'name'],
                        as: 'recipientDistrictInfo'
                    },
                    {
                        model: Ward,
                        attributes: ['id', 'name'],
                        as: 'recipientWardInfo'
                    },
                ],
                raw: true,
                nest: true
            });
            const { subject, htmlBody } = ordersTemplate(ordersInfo);
            const info = await sendEmail(undefined, email, subject, null, htmlBody);
            if (!info) {
                return buildErrorItem(RESOURCES.AUTHORIZATION, null, HttpStatus.NOT_ACCEPTABLE, Message.SEND_EMAIL_FOR_ORDERS_INFO_FAIL, {});
            }
        }
        return {};
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    createOrdersService,
};
