'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            email: {
                type: Sequelize.STRING(50),
            },
            password: {
                type: Sequelize.STRING // default 255
            },
            fullName: {
                type: Sequelize.STRING(128)
            },
            phoneNumber: {
                type: Sequelize.STRING(16)
            },
            gender: {
                type: Sequelize.ENUM,
                values: ['Male', 'Female', 'Other']
            },
            birthday: {
                type: Sequelize.DATE
            },
            provinceId: {
                type: Sequelize.UUID,
                references: {
                    model: 'provinces',
                    key: 'id'
                },
            },
            districtId: {
                type: Sequelize.UUID,
                references: {
                    model: 'districts',
                    key: 'id'
                },
            },
            wardId: {
                type: Sequelize.UUID,
                references: {
                    model: 'wards',
                    key: 'id'
                }
            },
            address: {
                type: Sequelize.STRING // default 255
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            isDeleted: {
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
        await queryInterface.dropTable('users');
    }
};
