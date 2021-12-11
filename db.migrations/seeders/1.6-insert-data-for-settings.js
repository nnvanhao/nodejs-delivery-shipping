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
            },
            // static pages
            {
                id: uuidv4(),
                key: SETTINGS_KEY.ABOUT_US,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.SERVICES,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.CONTACT,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.POLICY,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.TERMS_AND_CONDITIONS,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.SECURITY_AND_PRIVACY,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.SUPPORT,
                value: '',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                key: SETTINGS_KEY.TRANSPORT,
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
