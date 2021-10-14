'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PaymentTransaction', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            code: {
                type: Sequelize.STRING(32),
            },
            userBankId: {
                type: Sequelize.UUID,
                references: {
                    model: 'UserBanks',
                    key: 'id'
                },
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
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
        await queryInterface.dropTable('PaymentTransaction');
    }
};
