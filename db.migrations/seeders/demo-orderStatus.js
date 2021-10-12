'use strict';
const { v4: uuidv4 } = require('uuid');
const { CUSTOMER_TYPE } = require('../../src/constants/common.constant');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('OrdersStatus', [
            {
                id: uuidv4(),
                name: CUSTOMER_TYPE.PARTNER,
            },
            {
                id: uuidv4(),
                name: CUSTOMER_TYPE.OTHER,
            },
            {
                id: uuidv4(),
                name: CUSTOMER_TYPE.OTHER,
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('OrdersStatus', null, {});
    }
};
