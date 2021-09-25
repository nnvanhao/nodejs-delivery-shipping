const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');

const getToken = (email, password) => {
    let salt = crypto.randomBytes(16).toString('base64');
    const data = {
        email,
        password,
        refreshKey: salt,
    }
    let token = jwt.sign(data, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION_IN_SECONDS });
    return token;
};
const getRefreshToken = (userId) => {
    let refreshId = userId + config.JWT_SECRET;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
    let refreshToken = new Buffer(hash).toString('base64');
    return refreshToken;
};

module.exports = {
    getToken,
    getRefreshToken,
}