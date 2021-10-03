'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Districts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING(128),
            },
            type: {
                type: Sequelize.STRING(32)
            },
            provinceId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Provinces',
                    key: 'id'
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Districts');
    }
};
