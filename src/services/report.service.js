const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const { ROLE_TYPE, USER_STATUS, CUSTOMER_TYPE } = require("../constants/common.constant");
const db = require("../models/index");
const { Op } = require("sequelize");

const {
    User,
    UserRole,
    RoleType,
    Customer,
    CustomerType,
    Orders,
    OrdersStatuses
} = db;

const employeeReportService = async () => {
    try {
        const totalEmployee = await findAllUserByCondition();
        const totalActiveEmployee = await findAllUserByCondition({ status: USER_STATUS.ACTIVE });
        const totalInactiveEmployee = await findAllUserByCondition({
            status: {
                [Op.in]: [USER_STATUS.INACTIVE, USER_STATUS.WAITING_VERIFY],
            }
        });
        const data = {
            totalEmployee,
            totalActiveEmployee,
            totalInactiveEmployee
        }
        return data;
    } catch (error) {
        return buildErrorItem(RESOURCES.REPORTS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const customerReportService = async () => {
    try {
        const totalCustomer = await findAllUserByCondition({}, ROLE_TYPE.CUSTOMER);
        const totalPartner = await findAllUserByCondition({}, ROLE_TYPE.CUSTOMER, CUSTOMER_TYPE.PARTNER);
        const totalOther = await findAllUserByCondition({}, ROLE_TYPE.CUSTOMER, CUSTOMER_TYPE.OTHER);
        const totalActivePartner = await findAllUserByCondition({ status: USER_STATUS.ACTIVE }, ROLE_TYPE.CUSTOMER, CUSTOMER_TYPE.PARTNER);
        const totalInactivePartner = await findAllUserByCondition({
            status: {
                [Op.in]: [USER_STATUS.INACTIVE, USER_STATUS.WAITING_VERIFY],
            }
        }, ROLE_TYPE.CUSTOMER, CUSTOMER_TYPE.PARTNER);

        const data = {
            totalCustomer,
            totalPartner,
            totalOther,
            totalActivePartner,
            totalInactivePartner
        }
        return data;
    } catch (error) {
        return buildErrorItem(RESOURCES.REPORTS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const ordersReportService = async () => {
    try {
        const ordersStatusData = await OrdersStatuses.findAll({
            order: [
                ['sortIndex', 'ASC'],
            ], raw: true,
            where: {
                isDeleted: false
            }
        });
        const ordersByStatusReport = [];
        for (let i = 0; i < ordersStatusData.length; i++) {
            const ordersStatusItem = ordersStatusData[i];
            const { id, name, key } = ordersStatusItem;
            const totalOrdersByStatus = await findAllOrdersByCondition({}, id);
            ordersByStatusReport.push({ id, key, name, total: totalOrdersByStatus });
        }
        const totalOrders = await findAllOrdersByCondition();
        const data = {
            totalOrders,
            ordersByStatusReport
        }
        return data;
    } catch (error) {
        return buildErrorItem(RESOURCES.REPORTS, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const findAllOrdersByCondition = async (conditions = {}, ordersStatus) => {
    const hasOrdersStatus = ordersStatus ? true : false;
    const { count } = await Orders.findAndCountAll({
        where: {
            ...conditions,
            isDeleted: false
        },
        include: [
            {
                model: OrdersStatuses,
                attributes: ['id', 'name'],
                required: hasOrdersStatus,
                as: 'statusInfo',
                where: hasOrdersStatus && {
                    id: ordersStatus
                }
            },
        ],
        raw: true,
        nest: true
    });
    return count;
}

const findAllUserByCondition = async (conditions, role = ROLE_TYPE.EMPLOYEE, customerType) => {
    const hasCustomerType = customerType ? true : false;
    const { count } = await User.findAndCountAll({
        where: {
            isDeleted: false,
            ...conditions
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
                        where: {
                            name: role
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
        raw: true,
        nest: true
    });
    return count;
}

module.exports = {
    employeeReportService,
    customerReportService,
    ordersReportService
};
