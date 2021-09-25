const crypto = require('crypto');

function hashPassword(password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    const hashPassword = salt + "$" + hash;
    return hashPassword;
}

module.exports = { hashPassword };