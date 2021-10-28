const { Op } = require("sequelize");
const ordersCodeSize = 8;

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

const getQueryConditionsForSearchTextManyFields = (value, fields) => {
    return fields.map(field => {
        return {
            [field]: {
                [Op.like]: '%' + value + '%',
            }
        }
    })
}

const getCodeNumber = (number) => {
    var str = String(number + 1);
    while (str.length < ordersCodeSize) str = "0" + str;
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

const generateOrdersCode = (user, province, district) => {
    const { code } = user || {};
    const { shortName, code: provinceCode } = province || {};
    const { code:districtCode } = district || {};
    let index = 0;
    if (code) {
        index = code.slice(code.length - ordersCodeSize);
    }
    return `${provinceCode}${districtCode}${shortName}${getCodeNumber(parseInt(index))}`;
}

const  formatAddressString = (province, district, ward, address) => {
    const { name: provinceName = '' } = province || {};
    const { name: districtName = '' } = district || {};
    const { name: wardName = '' } = ward || {};
    return `${address ? `${address}` : ''}${wardName ? `, ${wardName}` : ''}${districtName ? `, ${districtName}` : ''}${provinceName ? `, ${provinceName}` : ''}`;
}

const VNDCurrencyFormatting = (value) => {
    const valueSelected = value || 0;
    return valueSelected.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

const handleGetApiPath = (params) => {
    return handleGetPath(params);
}

const handleGetPath = ( params) => {
    let path = '';
    let queryArray = [];
    if (params) {
        Object.keys(params).forEach(function (key) {
            if (params[key] !== null && params[key] !== undefined) {
                queryArray.push(key + '=' + params[key]);
            }
        });
        path += (queryArray.length ? '?' + queryArray.join('&') : '');
    }
    return path;
}

const isEmpty = (obj) => {
    if (obj === undefined || obj === null) {
        return true;
    }
    let empty = Object.keys(obj);
    return empty.length === 0;
}

module.exports = {
    getQueryConditionsForGetUsers,
    generateUserCode,
    VNDCurrencyFormatting,
    generateOrdersCode,
    formatAddressString,
    getQueryConditionsForSearchTextManyFields,
    handleGetApiPath,
    isEmpty
};
