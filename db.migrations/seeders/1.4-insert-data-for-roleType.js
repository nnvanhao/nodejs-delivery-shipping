'use strict';
const { v4: uuidv4 } = require('uuid');
const { ROLE_TYPE } = require('../../src/constants/common.constant');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('RoleTypes', [
            {
                id: '30ace94a-9231-4841-a32d-661bf068c8a7',
                name: ROLE_TYPE.ADMIN,
            },
            {
                id: '8768192d-c11b-494a-92ab-3d530ae32246',
                name: ROLE_TYPE.EMPLOYEE,
            },
            {
                id: '8fd16b64-d1bf-4575-8e20-f249ed23f481',
                name: ROLE_TYPE.CUSTOMER,
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('RoleTypes', null, {});
    }
};
