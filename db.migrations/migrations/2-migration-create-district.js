'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('district', {
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
                    model: 'province',
                    key: 'id'
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('district');
    }
};
