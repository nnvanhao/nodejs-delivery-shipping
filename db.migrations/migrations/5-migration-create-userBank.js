const { v4: uuidv4 } = require('uuid');

'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('userBank', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: uuidv4()
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                },
            },
            name: {
                type: Sequelize.STRING(128)
            },
            branchName: {
                type: Sequelize.STRING(128)
            },
            holderName: {
                type: Sequelize.STRING(128)
            },
            number: {
                type: Sequelize.STRING(64),
            },
            isDefault: {
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userBank');
    }
};
