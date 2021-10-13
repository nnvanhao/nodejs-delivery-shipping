'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Customers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                },
            },
            customerTypeId: {
                type: Sequelize.UUID,
                references: {
                    model: 'CustomerTypes',
                    key: 'id'
                },
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Customers');
    }
};
