'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Provinces', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            code: {
                type: Sequelize.STRING(5)
            },
            name: {
                type: Sequelize.STRING(128),
            },
            shortName: {
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
