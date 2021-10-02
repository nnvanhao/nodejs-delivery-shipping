'use strict';
const { v4: uuidv4 } = require('uuid');
const { ROLE_TYPE } = require('../../src/constants/common.constant');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roletypes', [
            {
                id: uuidv4(),
                name: ROLE_TYPE.ADMIN,
            },
            {
                id: uuidv4(),
                name: ROLE_TYPE.EMPLOYEE,
            },
            {
                id: uuidv4(),
                name: ROLE_TYPE.CUSTOMER,
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roletypes', null, {});
    }
};
