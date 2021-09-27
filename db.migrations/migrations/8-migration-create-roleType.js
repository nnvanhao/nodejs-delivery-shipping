'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('roletype', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('roletype');
    }
};
