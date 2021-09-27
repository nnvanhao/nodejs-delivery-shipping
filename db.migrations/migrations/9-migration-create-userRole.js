'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('userrole', {
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
                    model: 'roletype',
                    key: 'id'
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userrole');
    }
};
