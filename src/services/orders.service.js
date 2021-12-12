const HttpStatus = require("http-status-codes");
const axios = require('axios');
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const db = require("../models/index");
const { Op } = require("sequelize");
const { USER_CODE, ROLE_TYPE, CUSTOMER_TYPE, USER_STATUS, GHTK_API_URL } = require("../constants/common.constant");
const { generateUserCode, getQueryConditionsForGetUsers, generateOrdersCode, getQueryConditionsForSearchTextManyFields, handleGetApiPath, isEmpty } = require("../helpers/common.helper");
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
    sequelize,
    ResourceFiles
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
            recipientAmountPayment
        } = body;
        let user = null;
        if (!isPartner) {
            user = await User.findOne({
                where: {
                    email
                },
                raw: true
            });
        }
        const lastOrders = await Orders.findOne({
            limit: 1,
            order: [['createdAt', 'DESC']],
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
                if (user) {
                    body.orderCreatorId = user.id;
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
            }
            const ordersBody = {
                code: ordersCode,
                ...body,
                height: height || null,
                width: width || null,
                long: long || null,
                recipientAmountPayment: recipientAmountPayment || 0
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
        const { page, pageSize, fromDate, toDate, ordersStatus, searchText = '', employeeId } = query || {};
        const fromDateFormat = `${fromDate}T00:00:00.00Z`
        const toDateFormat = `${toDate}T23:59:00.00Z`
        const hasFilterDate = fromDate && toDate;
        const hasOrdersStatus = ordersStatus ? true : false;
        const hasEmployee = employeeId ? true : false;
        const ordersStatusSelected = hasOrdersStatus && ordersStatus.split(',');
        const offset = (parseInt(page) - 1) * pageSize || undefined;
        const limit = parseInt(pageSize) || undefined;
        let conditions = getQueryConditionsForGetUsers(query, ['code', 'status']);
        if (hasFilterDate) {
            conditions.createdAt = {
                [Op.between]: [fromDateFormat, toDateFormat]
            }
        }
        if (fromDate && !toDate) {
            conditions.createdAt = {
                [Op.gte]: fromDateFormat
            }
        }
        if (!fromDate && toDate) {
            conditions.createdAt = {
                [Op.lte]: toDateFormat
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
                }
            }
        }
        // for search text with many fields
        conditions = {
            ...conditions,
            [Op.or]: getQueryConditionsForSearchTextManyFields(searchText, ['code', 'pickupPhone', 'pickupName', 'recipientName', 'recipientPhone'])
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
                        id: ordersStatusSelected
                    }
                },
                {
                    model: User,
                    attributes: ['id', 'fullName'],
                    as: 'shipperInfo',
                    required: hasEmployee,
                    where: hasEmployee && {
                        id: employeeId
                    }
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
                    attributes: ['id', 'name', 'color'],
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
        const { shipperId, height, width, long, recipientAmountPayment } = body;
        return await sequelize.transaction(async (t) => {
            const ordersBody = {
                ...body,
                shipperId: shipperId || null,
                height: height || null,
                width: width || null,
                long: long || null,
                recipientAmountPayment: recipientAmountPayment || 0
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
            const { ordersId, ordersStatusId, images } = body || {};
            const ordersEventBody = {
                ...body,
                updateBy: userId
            }
            await Orders.update({ ordersStatusId }, { where: { id: ordersId } }, { transaction: t });
            const createOrdersEvent = (await OrdersEvents.create(ordersEventBody, { transaction: t })).get({ plain: true });
            if (!isEmpty(images) && !isEmpty(createOrdersEvent)) {
                for (let i = 0; i < images.length; i++) {
                    const image = images[0] || {};
                    await ResourceFiles.create({...image, targetId: createOrdersEvent.id }, { transaction: t });
                }
            }
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
            order: [
                ['createdAt', 'DESC']
            ],
            raw: true,
            nest: true
        });
        let ordersEvents = [];
        for (let i = 0; i < ordersInfo.length; i++) {
            const ordersEvent = ordersInfo[i];
            const { id } = ordersEvent || {};
            const resourceImages = await ResourceFiles.findAll({
                where: { targetId: id },
                raw: true,
                nest: true
            });
            ordersEvents.push({ ...ordersEvent, images: resourceImages });
        }
        return ordersEvents;
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getOrdersEventsByOrdersCodeService = async (req) => {
    try {
        const { query } = req;
        const { code } = query || {};
        const ordersInfo = await Orders.findOne({
            where: {
                code
            },
            raw: true,
        });
        if (!ordersInfo) {
            return [];
        }
        const { id: ordersId } = ordersInfo;
        const ordersEvents = await OrdersEvents.findAll({
            where: {
                ordersId
            },
            include: [
                {
                    model: OrdersStatuses,
                    attributes: ['id', 'name', 'color'],
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
            order: [
                ['createdAt', 'DESC']
            ],
            raw: true,
            nest: true
        });
        return ordersEvents;
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
            requiredTakePicture = false,
            color,
        } = body;

        const sortIndexOrdersStatusMaxNumber = await OrdersStatuses.max('sortIndex');

        const data = {
            name,
            color,
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
            isDeleted = false,
            color,
        } = body;

        const data = {
            name,
            requiredTakePicture,
            color,
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

const getShippingFeeService = async (req) => {
    try {
        const { query } = req;
        const url = `${GHTK_API_URL}${handleGetApiPath(query)}`;
        const options = {
            method: 'GET',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'token': '99d88d500abA136dAF22Bfa7c6B3762B337f3e39' },
            url: encodeURI(url),
        };
        const result = await axios(options);
        const { data } = result;
        return data;
    } catch (error) {
        return buildErrorItem(RESOURCES.ORDERS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
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
    deleteOrdersStatusService,
    getOrdersEventsByOrdersCodeService,
    getShippingFeeService
};
