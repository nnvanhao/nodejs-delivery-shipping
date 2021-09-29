const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');

const getToken = (email, userId) => {
    let salt = crypto.randomBytes(16).toString('base64');
    const data = {
        email,
        userId,
        refreshKey: salt,
    }
    let token = jwt.sign(data, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION_IN_SECONDS });
    return token;
};
const decodeToken = (token) => {
    var decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
};
const getRefreshToken = (userId) => {
    let refreshId = userId + config.JWT_SECRET;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
    let refreshToken = new Buffer(hash).toString('base64');
    return refreshToken;
};

const getTokenString = (token) => {
    const tokenString = token.split(' ').pop();
    return tokenString;
};

module.exports = {
    getToken,
    getRefreshToken,
    decodeToken,
    getTokenString
}
