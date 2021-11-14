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
    customerReportService
};
