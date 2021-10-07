const crypto = require('crypto');

function hashPassword(password) {
    let hash = crypto.createHmac('sha512', 'hunghao').update(password).digest("base64");
    const hashPassword = hash;
    return hashPassword;
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports = { hashPassword, generatePassword };