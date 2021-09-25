const { body } = require('express-validator');
const Message = require('../constants/message.constant');

const validateAuthRules = () => {
    return [
        body('email', Message.MISSING_EMAIL_PASSWORD_FIELDS).custom((value, { req }) => {
            const { email, username } = req.body;
            if (!email && !username) {
                return false;
            }
            return true;
        }),
        body('password', Message.MISSING_PASSWORD_FIELD).notEmpty(),
    ];
}

const validateSignUpRules = () => {
    return [
        body('username', Message.MISSING_USERNAME_FIELD).notEmpty(),
        body('username', Message.USERNAME_FIELD_MUST_BE_ALPHANUMERIC).isAlphanumeric(),
        body('username', Message.USERNAME_FIELD_MORE_THAN_6_DIGITS).isLength({ min: 6 }),
        body('email', Message.MISSING_EMAIL_FIELD).notEmpty(),
        body('email', Message.EMAIL_ADDRESS_INVALID).isEmail(),
        body('firstName', Message.MISSING_FIRSTNAME_FIELD).notEmpty(),
        body('lastName', Message.MISSING_LASTNAME_FIELD).notEmpty(),
        body('password', Message.PASSWORD_FIELD_MORE_THAN_6_DIGITS).isLength({ min: 6 }),
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
};