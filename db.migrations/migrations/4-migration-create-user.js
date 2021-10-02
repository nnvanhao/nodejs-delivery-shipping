'use strict';
const { USER_STATUS, GENDER } = require('../../src/constants/common.constant');

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
            emergencyPhoneNumber: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.ENUM,
                values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER]
            },
            status: {
                type: Sequelize.ENUM,
                values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.WAITING_VERIFY]
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
            isDeleted: {
                type: Sequelize.BOOLEAN
            },
            code: {
                type: Sequelize.STRING
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
