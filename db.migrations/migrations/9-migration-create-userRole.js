'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('userroles', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                },
            },
            roleTypeId: {
                type: Sequelize.UUID,
                references: {
                    model: 'roletypes',
                    key: 'id'
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userroles');
    }
};
