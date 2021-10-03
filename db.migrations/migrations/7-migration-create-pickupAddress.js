'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PickupAddress', {
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
            address: {
                type: Sequelize.STRING(128)
            },
            phoneNumber: {
                type: Sequelize.STRING(16)
            },
            provinceId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Provinces',
                    key: 'id'
                },
            },
            districtId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Districts',
                    key: 'id'
                },
            },
            wardId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Wards',
                    key: 'id'
                },
            },
            isDefault: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('PickupAddress');
    }
};
