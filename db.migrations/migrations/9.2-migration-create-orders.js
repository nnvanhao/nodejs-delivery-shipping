'use strict';

const { SHIPPING_FEE_PAYMENT } = require("../../src/constants/common.constant");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            code: {
                type: Sequelize.STRING,
            },
            ordersStatusId: {
                type: Sequelize.UUID,
                references: {
                    model: 'OrdersStatus',
                    key: 'id'
                },
            },
            shipperId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                },
            },
            orderCreatorId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                },
            },
            pickupName: {
                type: Sequelize.STRING,
            },
            pickupPhone: {
                type: Sequelize.STRING,
            },
            pickupPostalCode: {
                type: Sequelize.STRING,
            },
            pickupProvince: {
                type: Sequelize.UUID,
                references: {
                    model: 'Provinces',
                    key: 'id'
                },
            },
            pickupDistrict: {
                type: Sequelize.UUID,
                references: {
                    model: 'Districts',
                    key: 'id'
                },
            },
            pickupWard: {
                type: Sequelize.UUID,
                references: {
                    model: 'Wards',
                    key: 'id'
                }
            },
            pickupAddress: {
                type: Sequelize.STRING,
            },
            pickupDate: {
                type: Sequelize.DATE,
            },
            recipientName: {
                type: Sequelize.STRING,
            },
            recipientPhone: {
                type: Sequelize.STRING,
            },
            recipientPostalCode: {
                type: Sequelize.STRING,
            },
            recipientProvince: {
                type: Sequelize.UUID,
                references: {
                    model: 'Provinces',
                    key: 'id'
                },
            },
            recipientDistrict: {
                type: Sequelize.UUID,
                references: {
                    model: 'Districts',
                    key: 'id'
                },
            },
            recipientWard: {
                type: Sequelize.UUID,
                references: {
                    model: 'Wards',
                    key: 'id'
                }
            },
            recipientAddress: {
                type: Sequelize.STRING,
            },
            recipientImage: {
                type: Sequelize.STRING,
            },
            weight: {
                type: Sequelize.FLOAT,
            },
            width: {
                type: Sequelize.FLOAT,
            },
            long: {
                type: Sequelize.FLOAT,
            },
            height: {
                type: Sequelize.FLOAT,
            },
            ordersName: {
                type: Sequelize.STRING,
            },
            ordersQuantity: {
                type: Sequelize.INTEGER,
            },
            shippingFeePayment: {
                type: Sequelize.ENUM,
                values: [SHIPPING_FEE_PAYMENT.SENDER_PAY, SHIPPING_FEE_PAYMENT.RECEIVER_PAY]
            },
            isCOD: {
                type: Sequelize.BOOLEAN,
            },
            isGuaranteed: {
                type: Sequelize.BOOLEAN,
            },
            shippingFee: {
                type: Sequelize.FLOAT,
            },
            totalValue: {
                type: Sequelize.FLOAT,
            },
            recipientAmountPayment: {
                type: Sequelize.FLOAT,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('Orders');
    }
};
