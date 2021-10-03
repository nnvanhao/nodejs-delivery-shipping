'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Provinces', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING(128),
            },
            code: {
                type: Sequelize.STRING(3)
            },
            type: {
                type: Sequelize.STRING(32)
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Provinces');
    }
};
