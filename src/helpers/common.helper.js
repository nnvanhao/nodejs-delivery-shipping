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

const generateOrdersCode = (user, province, district) => {
    const { code } = user || {};
    const { shortName, code: provinceCode } = province || {};
    const { code:districtCode } = district || {};
    let index = 0;
    if (code) {
        index = code.slice(code.length - 5);
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

module.exports = {
    getQueryConditionsForGetUsers,
    generateUserCode,
    VNDCurrencyFormatting,
    generateOrdersCode,
    formatAddressString
};
