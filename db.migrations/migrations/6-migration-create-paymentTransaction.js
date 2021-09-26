const { v4: uuidv4 } = require('uuid');

'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('paymenttransaction', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: uuidv4()
            },
            code: {
                type: Sequelize.STRING(32),
            },
            userBankId: {
                type: Sequelize.UUID,
                references: {
                    model: 'userbank',
                    key: 'id'
                },
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                },
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            paymentDate: {
                type: Sequelize.DATE,
            },
            status: {
                type: Sequelize.STRING(64)
            },
            note: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('paymenttransaction');
    }
};
