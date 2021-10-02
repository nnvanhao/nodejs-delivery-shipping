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

module.exports = {
    getQueryConditionsForGetUsers,
};