const { body } = require('express-validator');
const Message = require('../constants/message.constant');

const validateAuthRules = () => {
    return [
        body('email', Message.MISSING_EMAIL_FIELD).notEmpty(),
        body('email', Message.EMAIL_ADDRESS_INVALID).isEmail(),
        body('password', Message.MISSING_PASSWORD_FIELD).notEmpty(),
        body('password', Message.PASSWORD_FIELD_MORE_THAN_6_DIGITS).isLength({ min: 6 }),
    ];
}

const validateSignUpRules = () => {
    return [
        body('email', Message.MISSING_EMAIL_FIELD).notEmpty(),
        body('email', Message.EMAIL_ADDRESS_INVALID).isEmail(),
        body('password', Message.PASSWORD_FIELD_MORE_THAN_6_DIGITS).isLength({ min: 6 }),
        body('phoneNumber', Message.MISSING_EMAIL_FIELD).notEmpty(),
        body('phoneNumber', Message.PHONE_NUMBER_FIELD_MORE_THAN_10_DIGITS).isLength({ min: 10, max: 16 }),
    ];
}

const validateCreateUserRules = () => {
    return [
        body('email', Message.MISSING_EMAIL_FIELD).notEmpty(),
        body('email', Message.EMAIL_ADDRESS_INVALID).isEmail(),
        body('phoneNumber', Message.MISSING_EMAIL_FIELD).notEmpty(),
        body('phoneNumber', Message.PHONE_NUMBER_FIELD_MORE_THAN_10_DIGITS).isLength({ min: 10, max: 16 }),
        body('fullName', Message.MISSING_FULL_NAME_FIELD).notEmpty(),
    ];
}

const validateRefreshAuthRules = () => {
    return [
        body('refreshToken', Message.MISSING_REFRESH_TOKEN_FIELD).notEmpty(),
    ];
}

module.exports = {
    validateAuthRules,
    validateSignUpRules,
    validateRefreshAuthRules,
    validateCreateUserRules
};