'use strict';
const { v4: uuidv4 } = require('uuid');
const { SETTINGS_KEY } = require('../../src/constants/common.constant');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Settings', [
            {
                id: uuidv4(),
                key: SETTINGS_KEY.BRAND_IMAGE,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.BANNER_IMAGES,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.AUTH_IMAGE,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Settings', null, {});
    }
};
