const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");
const { USER_CODE, ROLE_TYPE, CUSTOMER_TYPE, USER_STATUS } = require("../constants/common.constant");
const { generateUserCode, getQueryConditionsForGetUsers, generateOrdersCode } = require("../helpers/common.helper");
const { ordersTemplate, sendEmail } = require("../helpers/mailer.helper");
const { getTokenString, decodeToken } = require("../helpers/token.helper");
const { getUserAccessRole } = require("../middlewares/verify.permission.middleware");

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
    OrdersStatuses,
    OrdersEvents,
    sequelize
} = db;

const createOrdersService = async (req) => {
    try {
        const { body, headers: { authorization } } = req;
        const {
            isPartner,
            pickupName,
            pickupPhone,
            email,
            pickupProvince,
            pickupDistrict,
            pickupWard,
            pickupAddress,
            recipientProvince,
            recipientDistrict,
            height = 0,
            width = 0,
            long = 0,
        } = body;
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
        const recipientProvinceInfo = await Province.findOne({
            where: {
                id: recipientProvince
            },
            raw: true,
        });
        const recipientDistrictInfo = await District.findOne({
            where: {
                id: recipientDistrict
            },
            raw: true,
        });
        const defaultOrdersStatus = await OrdersStatuses.findOne({
            where: {
                sortIndex: 0
            },
            raw: true,
        });
        const { id: ordersStatusId } = defaultOrdersStatus;
        if (authorization && isPartner) {
            const token = getTokenString(authorization);
            const { userId: userCreateId } = decodeToken(token);
            body.orderCreatorId = userCreateId;
        }
        body.ordersStatusId = ordersStatusId;
        const ordersCode = generateOrdersCode(lastOrders, recipientProvinceInfo, recipientDistrictInfo);
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
                ...body,
                height: height || 0,
                width: width || 0,
                long: long || 0
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

const getOrdersService = async (req) => {
    try {
        const { query, headers: { authorization } } = req;
        const { page, pageSize, fromDate, toDate, ordersStatus, searchText = '' } = query || {};
        const fromDateFormat = `${fromDate}T00:00:00.00Z`
        const toDateFormat = `${toDate}T23:59:00.00Z`
        const hasFilterDate = fromDate && toDate;
        const hasOrdersStatus = ordersStatus ? true : false;
        const offset = (parseInt(page) - 1) * pageSize || undefined;
        const limit = parseInt(pageSize) || undefined;
        let conditions = getQueryConditionsForGetUsers(query, ['code', 'status']);
        if (hasFilterDate) {
            conditions.createdAt = {
                [Op.between]: [fromDateFormat, toDateFormat]
            }
        }
        if (authorization) {
            const token = getTokenString(authorization);
            const { userId } = decodeToken(token);
            const userAccessRole = await getUserAccessRole(userId);
            if (userAccessRole === ROLE_TYPE.CUSTOMER) {
                conditions.orderCreatorId = userId;
            } else if (userAccessRole === ROLE_TYPE.EMPLOYEE) {
                conditions = {
                    ...conditions,
                    shipperId: userId,
                    [Op.or]: [
                        { recipientName: {
                            [Op.like]: '%' + searchText + '%',
                        } },
                        { recipientPhone: {
                            [Op.like]: '%' + searchText + '%',
                        } }
                    ],
                }
            }
        }
        const { count, rows } = await Orders.findAndCountAll({
            where: {
                ...conditions,
                isDeleted: false
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
                {
                    model: OrdersStatuses,
                    attributes: ['id', 'name'],
                    as: 'statusInfo',
                    required: hasOrdersStatus,
                    where: hasOrdersStatus && {
                        name: [ordersStatus]
                    }
                },
                {
                    model: User,
                    attributes: ['id', 'fullName'],
                    as: 'shipperInfo'
                },
                {
                    model: User,
                    attributes: ['id', 'fullName'],
                    as: 'orderCreatorInfo'
                },
            ],
            attributes: {
                exclude: [
                    'shippingFee',
                    'isDeleted',
                    'pickupProvince',
                    'pickupDistrict',
                    'pickupWard',
                    'recipientProvince',
                    'recipientDistrict',
                    'recipientWard',
                    'ordersStatusId',
                    'shipperId',
                    'orderCreatorId'
                ]
            },
            offset,
            limit,
            order: [
                ['createdAt', 'DESC']
            ],
            raw: true,
            nest: true
        });
        return {
            items: rows,
            total: count
        };
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getOrdersByIdService = async (req) => {
    try {
        const { params } = req;
        const { id: ordersId } = params || {};
        const ordersInfo = await Orders.findOne({
            where: {
                id: ordersId
            },
            attributes: {
                exclude: [
                    'orderCreatorId',
                    'shipperId',
                    'ordersStatusId',
                    'isDeleted'
                ]
            },
            include: [
                {
                    model: OrdersStatuses,
                    attributes: ['id', 'name'],
                    as: 'statusInfo',
                },
                {
                    model: User,
                    attributes: ['id', 'fullName'],
                    as: 'shipperInfo'
                },
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
        });
        return ordersInfo;
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const updateOrdersService = async (req) => {
    try {
        const { body, params } = req;
        const { id: ordersId } = params || {};
        return await sequelize.transaction(async (t) => {
            const ordersBody = {
                ...body
            }
            await Orders.update(ordersBody, { where: { id: ordersId } }, { transaction: t });
            return {};
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const deleteOrdersService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { params } = req;
            const { id: ordersId } = params || {};
            await Orders.update({ isDeleted: true }, { where: { id: ordersId } }, { transaction: t });
            return {};
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const createOrdersEventService = async (req) => {
    try {
        return await sequelize.transaction(async (t) => {
            const { body, headers: { authorization } } = req;
            const token = getTokenString(authorization);
            const { userId } = decodeToken(token);
            const { ordersId, ordersStatusId } = body || {};
            const ordersEventBody = {
                ...body,
                updateBy: userId
            }
            await Orders.update({ ordersStatusId }, { where: { id: ordersId } }, { transaction: t });
            await OrdersEvents.create(ordersEventBody, { transaction: t });
            return {};
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getOrdersEventsService = async (req) => {
    try {
        const { params } = req;
        const { id: ordersId } = params || {};
        const ordersInfo = await OrdersEvents.findAll({
            where: {
                ordersId
            },
            include: [
                {
                    model: OrdersStatuses,
                    attributes: ['id', 'name'],
                    as: 'statusInfo',
                },
                {
                    model: User,
                    attributes: ['id', 'fullName'],
                    as: 'updatedByUser'
                },
                {
                    model: Province,
                    attributes: ['id', 'name'],
                    as: 'provinceInfo'
                },
                {
                    model: District,
                    attributes: ['id', 'name'],
                    as: 'districtInfo'
                },
                {
                    model: Ward,
                    attributes: ['id', 'name'],
                    as: 'wardInfo'
                },
            ],
            raw: true,
            nest: true
        });
        return ordersInfo;
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getOrdersStatusesService = async () => {
    try {
        return await OrdersStatuses.findAll({
            order: [
                ['sortIndex', 'ASC'],
            ], raw: true,
            where: {
                isDeleted: false
            }
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS_STATUS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getOrdersStatusByIdService = async (req) => {
    try {
        const { params } = req;
        const { id: ordersStatusId } = params || {};
        return await OrdersStatuses.findOne({
            where: {
                id: ordersStatusId
            },
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS_STATUS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const createOrdersStatusService = async (req) => {
    try {
        const { body } = req;
        const {
            name,
            requiredTakePicture = false
        } = body;

        const sortIndexOrdersStatusMaxNumber = await OrdersStatuses.max('sortIndex');

        const data = {
            name,
            sortIndex: sortIndexOrdersStatusMaxNumber + 1,
            required: false,
            requiredTakePicture,
            isDeleted: false,
        }
        return await OrdersStatuses.create(data);

    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS_STATUS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const updateOrdersStatusService = async (req) => {
    try {
        const { params, body } = req;
        const { id: ordersStatusId } = params || {};

        const {
            name,
            requiredTakePicture = false,
            isDeleted = false
        } = body;

        const data = {
            name,
            requiredTakePicture,
            isDeleted
        }

        if (ordersStatusId) {
            const ordersStatus = await OrdersStatuses.findOne({
                where: {
                    id: ordersStatusId
                },
            });
            return await ordersStatus.update(data);
        }
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS_STATUS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const updateSortIndexOrdersStatusService = async (req) => {
    try {
        const { body } = req;

        const {
            ordersStatuses = [],
        } = body;

        for (let i = 0; i < ordersStatuses.length; i++) {
            const { id: ordersStatusId } = ordersStatuses[i];
            await OrdersStatuses.update({ sortIndex: ordersStatuses[i].sortIndex }, { where: { id: ordersStatusId } });
        }

        return await OrdersStatuses.findAll({
            order: [
                ['sortIndex', 'ASC'],
            ], raw: true
        });
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS_STATUS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const deleteOrdersStatusService = async (req) => {
    try {
        const { params } = req;
        const { id: ordersStatusId } = params || {};

        if (ordersStatusId) {
            return await OrdersStatuses.update({ isDeleted: true }, { where: { id: ordersStatusId } });
        }
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS_STATUS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    createOrdersService,
    getOrdersService,
    getOrdersByIdService,
    updateOrdersService,
    deleteOrdersService,
    createOrdersEventService,
    getOrdersEventsService,
    getOrdersStatusesService,
    getOrdersStatusByIdService,
    createOrdersStatusService,
    updateOrdersStatusService,
    updateSortIndexOrdersStatusService,
    deleteOrdersStatusService
};
