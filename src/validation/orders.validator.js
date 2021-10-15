const { body } = require('express-validator');
const Message = require('../constants/message.constant');

const validateCreateOrdersRules = () => {
    return [
        body('pickupName', Message.MISSING_PICKUP_NAME_FIELD).notEmpty(),
        body('pickupPhone', Message.MISSING_PICKUP_PHONE_FIELD).notEmpty(),
        body('pickupProvince', Message.MISSING_PICKUP_PROVINCE_FIELD).notEmpty(),
        body('pickupDistrict', Message.MISSING_PICKUP_DISTRICT_FIELD).notEmpty(),
        body('pickupWard', Message.MISSING_PICKUP_WARD_FIELD).notEmpty(),
        body('pickupAddress', Message.MISSING_PICKUP_ADDRESS_FIELD).notEmpty(),
        body('pickupDate', Message.MISSING_PICKUP_DATE_FIELD).notEmpty(),
        body('recipientName', Message.MISSING_RECIPIENT_NAME_FIELD).notEmpty(),
        body('recipientPhone', Message.MISSING_RECIPIENT_PHONE_FIELD).notEmpty(),
        body('recipientPostalCode', Message.MISSING_RECIPIENT_POSTAL_CODE_FIELD).notEmpty(),
        body('recipientProvince', Message.MISSING_RECIPIENT_PROVINCE_FIELD).notEmpty(),
        body('recipientDistrict', Message.MISSING_RECIPIENT_DISTRICT_FIELD).notEmpty(),
        body('recipientWard', Message.MISSING_RECIPIENT_WARD_FIELD).notEmpty(),
        body('recipientAddress', Message.MISSING_RECIPIENT_ADDRESS_FIELD).notEmpty(),
        body('weight', Message.MISSING_WEIGHT_FIELD).notEmpty(),
        body('ordersName', Message.MISSING_ORDERS_NAME_FIELD).notEmpty(),
        body('ordersQuantity', Message.MISSING_ORDERS_QUANTITY_FIELD).notEmpty(),
    ];
}

const validateCreateOrdersStatusRules = () => {
    return [
        body('name', Message.MISSING_ORDERS_NAME_FIELD).notEmpty(),
        body('requiredTakePicture', Message.MISSING_ORDERS_REQUIRED_TAKE_PICTURE_FIELD).notEmpty(),
    ];
}

module.exports = {
    validateCreateOrdersRules,
    validateCreateOrdersStatusRules,
};
