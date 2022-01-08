const Excel = require('exceljs');
const { EXPORT_TYPE, ROLE_TYPE } = require('../constants/common.constant');
const { LANG } = require('../lang/vi');

const getHeadingByExportType = (data) => {
    const { exportType, roleType } = data;
    let heading = [];
    switch (exportType) {
        case EXPORT_TYPE.USERS: {
            heading = [
                { header: LANG.EXPORT.USERS.STT, key: 'stt', width: 10 },
                { header: LANG.EXPORT.CODE[roleType], key: 'code', width: 20 },
                { header: LANG.EXPORT.USERS.FULL_NAME, key: 'fullName', width: 25 },
                { header: LANG.EXPORT.USERS.PHONE_NUMBER, key: 'phoneNumber', width: 20 },
                { header: LANG.EXPORT.USERS.EMAIL, key: 'email', width: 30 },
                { header: LANG.EXPORT.USERS.CUSTOMER_TYPE, key: 'customerType', width: 20 },
                { header: LANG.EXPORT.USERS.STATUS, key: 'status', width: 20 }
            ]
            if (roleType === ROLE_TYPE.EMPLOYEE) {
                heading = [
                    { header: LANG.EXPORT.USERS.STT, key: 'stt', width: 10 },
                    { header: LANG.EXPORT.CODE[roleType], key: 'code', width: 20 },
                    { header: LANG.EXPORT.USERS.FULL_NAME, key: 'fullName', width: 25 },
                    { header: LANG.EXPORT.USERS.PHONE_NUMBER, key: 'phoneNumber', width: 20 },
                    { header: LANG.EXPORT.USERS.EMAIL, key: 'email', width: 30 },
                    { header: LANG.EXPORT.USERS.STATUS, key: 'status', width: 20 }
                ]
            }
        }
            break;
        case EXPORT_TYPE.ORDERS:
            heading = [
                { header: LANG.EXPORT.USERS.STT, key: 'stt', width: 10 },
                { header: LANG.EXPORT.CODE.ORDERS, key: 'code', width: 20 },
                { header: LANG.EXPORT.ORDERS.STATUS, key: 'ordersStatus', width: 25 },

                { header: LANG.EXPORT.ORDERS.RECIPIENT_NAME, key: 'recipientName', width: 25 },
                { header: LANG.EXPORT.ORDERS.RECIPIENT_PHONE, key: 'recipientPhone', width: 20 },
                { header: LANG.EXPORT.ORDERS.RECIPIENT_POST_CODE, key: 'recipientPostalCode', width: 30 },
                { header: LANG.EXPORT.ORDERS.RECIPIENT_ADDRESS, key: 'recipientAddress', width: 60 },

                { header: LANG.EXPORT.ORDERS.PICK_UP_NAME, key: 'pickupName', width: 25 },
                { header: LANG.EXPORT.ORDERS.PICK_UP_PHONE, key: 'pickupPhone', width: 20 },
                { header: LANG.EXPORT.ORDERS.PICK_UP_POST_CODE, key: 'pickupPostalCode', width: 30 },
                { header: LANG.EXPORT.ORDERS.PICK_UP_ADDRESS, key: 'pickupAddress', width: 60 },

                { header: LANG.EXPORT.ORDERS.ORDER_NAME, key: 'ordersName', width: 60 },
                { header: LANG.EXPORT.ORDERS.WEIGHT, key: 'weight', width: 20 },
                { header: LANG.EXPORT.ORDERS.QUANTITY, key: 'ordersQuantity', width: 20 },
                { header: LANG.EXPORT.ORDERS.FEE, key: 'shippingFee', width: 20 },
                { header: LANG.EXPORT.ORDERS.SHIPPING_FEE_PAYMENT, key: 'shippingFeePayment', width: 30 },
                { header: LANG.EXPORT.ORDERS.TOTAL_VALUE, key: 'totalValue', width: 20 },
                { header: LANG.EXPORT.ORDERS.RECIPIENT_AMOUNT_PAYMENT, key: 'recipientAmountPayment', width: 20 },
                { header: LANG.EXPORT.ORDERS.SHIPPER_NAME, key: 'shipperName', width: 25 },

                { header: LANG.EXPORT.ORDERS.CREATED_AT, key: 'createdAt', width: 25 },
            ]
            break;
        case EXPORT_TYPE.ORDERS_EVENTS:
            heading = [
                { header: LANG.EXPORT.USERS.STT, key: 'stt', width: 12 },
                { header: LANG.EXPORT.ORDERS_EVENTS.TIME, key: 'createdAt', width: 20 },
                { header: LANG.EXPORT.ORDERS.STATUS, key: 'ordersStatus', width: 30 },
                { header: LANG.EXPORT.ORDERS_EVENTS.ADDRESS, key: 'address', width: 40 },
                { header: LANG.EXPORT.ORDERS_EVENTS.UPDATED_BY, key: 'updatedByUser', width: 20 },
            ]
            break;
        default:
            break;
    }
    return heading;
}

const handleCreateExcelFile = (heading, sheetData, sheetName) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = heading;
    sheetData.forEach((data, index) => {
        const row = worksheet.addRow(data);
        row.eachCell({ includeEmpty: false }, function (cell, rowNumber) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        });
    });
    var headerRow = worksheet.getRow(1);
    headerRow.eachCell({ includeEmpty: false }, function (cell, rowNumber) {
        cell.font = { ...cell.font, bold: true, size: 12.75 };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E5E5E5' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    });
    return workbook;
}

module.exports = {
    handleCreateExcelFile,
    getHeadingByExportType
};
