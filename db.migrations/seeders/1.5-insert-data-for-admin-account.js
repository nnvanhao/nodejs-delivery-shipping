'use strict';
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../../src/helpers/password.helper');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                id: uuidv4(),
                email: 'admin@gmail.com',
                phoneNumber: '0123456789',
                password: hashPassword('123456'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
