'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ward', {
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
            districtId: {
                type: Sequelize.UUID,
                references: {
                    model: 'district',
                    key: 'id'
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ward');
    }
};
