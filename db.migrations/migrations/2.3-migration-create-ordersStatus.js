'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('OrdersStatuses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING,
            },
            sortIndex: {
                type: Sequelize.INTEGER,
            },
            required: {
                type: Sequelize.BOOLEAN,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('OrdersStatuses');
    }
};
