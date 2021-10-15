'use strict';
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../../src/helpers/password.helper');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const userId = uuidv4();
        return Promise.all([
            queryInterface.bulkInsert('Users', [
                {
                    id: userId,
                    email: 'admin@gmail.com',
                    phoneNumber: '0123456789',
                    password: hashPassword('123456'),
                    isDeleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ]),
            queryInterface.bulkInsert('UserRoles', [
                {
                    id: uuidv4(),
                    userId: userId,
                    roleTypeId: '30ace94a-9231-4841-a32d-661bf068c8a7',
                },
            ])
        ])
    },

    down: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.bulkDelete('UserRoles', null, {}),
            queryInterface.bulkDelete('Users', null, {})
        ])
    }
};
