'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('OrdersEvents', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            ordersStatusId: {
                type: Sequelize.UUID,
                references: {
                    model: 'OrdersStatuses',
                    key: 'id'
                },
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
                }
            },
            ordersId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Orders',
                    key: 'id'
                }
            },
            address: {
                type: Sequelize.STRING,
            },
            notes: {
                type: Sequelize.STRING,
            },
            updateBy: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                },
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
        await queryInterface.dropTable('OrdersEvents');
    }
};
