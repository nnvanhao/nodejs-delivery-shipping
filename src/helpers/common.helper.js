const { Op } = require("sequelize");

const getQueryConditionsForGetUsers = (query, fields) => {
    conditions = {};
    fields.forEach(field => {
        // Query param name
        if (query[field]) {
            conditions[field] = {
                [Op.like]: '%' + (query[field]) + '%'
            }
        }
    });
    return conditions;
}

const getCodeNumber = (number) => {
    var str = String(number + 1);
    while (str.length < 5) str = "0" + str;
    return str;
}

const generateUserCode = (user, prefix) => {
    const { code } = user || {};
    let index = 0;
    if (code) {
        index = code.split(prefix).pop();
    }
    return `${prefix}${getCodeNumber(parseInt(index))}`;
}

module.exports = {
    getQueryConditionsForGetUsers,
    generateUserCode
};
