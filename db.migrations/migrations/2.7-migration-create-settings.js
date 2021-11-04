'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Settings', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            key: {
                type: Sequelize.STRING,
            },
            value: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Settings');
    }
};
