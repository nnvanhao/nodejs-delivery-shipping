const { v4: uuidv4 } = require('uuid');

'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('pickupAddress', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: uuidv4()
            },
            userId: {
                type: Sequelize.UUID,
                // references: {
                //     model: 'users',
                //     key: 'id'
                // },
                // unique: true
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
                    model: 'province',
                    key: 'id'
                },
            },
            districtId: {
                type: Sequelize.UUID,
                references: {
                    model: 'district',
                    key: 'id'
                },
            },
            wardId: {
                type: Sequelize.UUID,
                references: {
                    model: 'ward',
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
        await queryInterface.dropTable('pickupAddress');
    }
};
