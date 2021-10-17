const HttpStatus = require("http-status-codes");
const dayjs = require('dayjs');
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const { ROLE_TYPE_LANG, EXPORT_TYPE } = require("../constants/common.constant");
const { LANG } = require('../lang/vi');
const { handleCreateExcelFile, getHeadingByExportType } = require("../helpers/exportExcel.helper");
const { getUsersService } = require("./user.service");
const { getOrdersService, getOrdersEventsService } = require("./orders.service");

const excelExportService = async (req, res) => {
    try {
        const { query } = req;
        const { exportType = EXPORT_TYPE.USERS } = query || {};
        let sheetHeading = '';
        let sheetData = [];
        let fileNameData = '';
        let sheetNameData = '';
        switch (exportType) {
            case EXPORT_TYPE.USERS:
                const { heading, data, fileName, sheetName } = await getUsersData(req, exportType);
                sheetHeading = heading;
                sheetData = data;
                fileNameData = fileName;
                sheetNameData = sheetName;
                break;
            case EXPORT_TYPE.ORDERS:
                const {
                    ordersHeading,
                    ordersData,
                    ordersFileName,
                    ordersSheetName
                } = await getOrdersData(req, exportType);
                sheetHeading = ordersHeading;
                sheetData = ordersData;
                fileNameData = ordersFileName;
                sheetNameData = ordersSheetName;
                break;
            case EXPORT_TYPE.ORDERS:
                const {
                    ordersEventsHeading,
                    ordersEventsData,
                    ordersEventsFileName,
                    ordersEventsSheetName
                } = await getOrdersEventsData(req, exportType);
                sheetHeading = ordersEventsHeading;
                sheetData = ordersEventsData;
                fileNameData = ordersEventsFileName;
                sheetNameData = ordersEventsSheetName;
                break;
            default:
                break;
        }
        let workbook = handleCreateExcelFile(sheetHeading, sheetData, sheetNameData);
        res.setHeader('Content-Type', 'text/xlsx');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + fileNameData
        );
        workbook.xlsx.write(res)
            .then(function () {
                res.end()
            });
    } catch (error) {
        return buildErrorItem(RESOURCES.USER, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

const getUsersData = async (req, exportType) => {
    const { query } = req;
    const { roleType } = query || {};
    const { items: users = [] } = await getUsersService(req);
    const usersFormat = users.map((user, index) => {
        const { code, fullName, phoneNumber, email, status, Customer } = user;
        const { CustomerType } = Customer || {};
        const { name } = CustomerType || {};
        return {
            stt: (index + 1).toString(),
            code,
            fullName,
            phoneNumber,
            email,
            customerType: LANG.EXPORT.CUSTOMER_TYPE[name],
            status: LANG.EXPORT.USER_STATUS[status],
        }
    });
    const fileName = `${ROLE_TYPE_LANG[roleType]}_${dayjs().format("DD-MM-YYYY_HH.mm.ss")}.xlsx`;
    return {
        heading: getHeadingByExportType({ exportType, roleType }),
        data: usersFormat,
        fileName,
        sheetName: ROLE_TYPE_LANG[roleType]
    }
}

const getOrdersData = async (req, exportType) => {
    const { items: ordersList = [] } = await getOrdersService(req);
    const ordersListFormat = ordersList.map((orders, index) => {
        const { code, statusInfo, recipientName, recipientPhone, createdAt, recipientAddress } = orders;
        const { name: ordersStatusName } = statusInfo || {};
        return {
            stt: (index + 1).toString(),
            code,
            createdAt: dayjs(createdAt).format("DD-MM-YYYY - HH:mm:ss"),
            ordersStatus: ordersStatusName,
            recipientName,
            recipientPhone,
            recipientAddress,
        }
    });
    const ordersFileName = `${ROLE_TYPE_LANG.ORDERS}_${dayjs().format("DD-MM-YYYY_HH.mm.ss")}.xlsx`;
    return {
        ordersHeading: getHeadingByExportType({ exportType }),
        ordersData: ordersListFormat,
        ordersFileName,
        ordersSheetName: ROLE_TYPE_LANG.ORDERS
    }
}

const getOrdersEventsData = async (req, exportType) => {
    const { query } = req;
    const { ordersId } = query || {};
    const data = {
        id: ordersId
    }
    const ordersEvents = await getOrdersEventsService(data);
    const ordersEventsFormat = ordersEvents.map((event, index) => {
        const { statusInfo, createdAt, address, updatedByUser } = event;
        const { name: ordersStatusName } = statusInfo || {};
        const { fullName } = updatedByUser || {};
        return {
            stt: (index + 1).toString(),
            createdAt: dayjs(createdAt).format("DD-MM-YYYY - HH:mm:ss"),
            ordersStatus: ordersStatusName,
            address,
            updatedByUser: fullName,
        }
    });
    const ordersEventsFileName = `${ROLE_TYPE_LANG.ORDERS_EVENTS}_${dayjs().format("DD-MM-YYYY_HH.mm.ss")}.xlsx`;
    return {
        ordersEventsHeading: getHeadingByExportType({ exportType }),
        ordersEventsData: ordersEventsFormat,
        ordersEventsFileName,
        ordersEventsSheetName: ROLE_TYPE_LANG.ORDERS_EVENTS
    }
}

module.exports = {
    excelExportService
};
