'use strict';
const {
    Model
} = require('sequelize');
const { SHIPPING_FEE_PAYMENT } = require('../constants/common.constant');
module.exports = (sequelize, DataTypes) => {
    class Orders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of DataTypes lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Orders.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
        },
        code: {
            type: DataTypes.STRING,
        },
        statusOrderId: {
            type: DataTypes.STRING,
        },
        shipperId: {
            type: DataTypes.STRING,
        },
        orderCreatorId: {
            type: DataTypes.STRING,
        },
        pickupName: {
            type: DataTypes.STRING,
        },
        pickupPhone: {
            type: DataTypes.STRING,
        },
        pickupPostalCode: {
            type: DataTypes.STRING,
        },
        pickupProvince: {
            type: DataTypes.STRING,
        },
        pickupDistrict: {
            type: DataTypes.STRING,
        },
        pickupWard: {
            type: DataTypes.STRING,
        },
        pickupAddress: {
            type: DataTypes.STRING,
        },
        pickupDate: {
            type: DataTypes.DATE,
        },
        recipientName: {
            type: DataTypes.STRING,
        },
        recipientPhone: {
            type: DataTypes.STRING,
        },
        recipientPostalCode: {
            type: DataTypes.STRING,
        },
        recipientZipCode: {
            type: DataTypes.STRING,
        },
        recipientProvince: {
            type: DataTypes.STRING,
        },
        recipientDistrict: {
            type: DataTypes.STRING,
        },
        recipientWard: {
            type: DataTypes.STRING,
        },
        recipientAddress: {
            type: DataTypes.STRING,
        },
        recipientImage: {
            type: DataTypes.STRING,
        },
        weight: {
            type: DataTypes.FLOAT,
        },
        width: {
            type: DataTypes.FLOAT,
        },
        long: {
            type: DataTypes.FLOAT,
        },
        height: {
            type: DataTypes.FLOAT,
        },
        ordersName: {
            type: DataTypes.STRING,
        },
        ordersQuantity: {
            type: DataTypes.INTEGER,
        },
        shippingFeePayment: {
            type: DataTypes.ENUM,
            values: [SHIPPING_FEE_PAYMENT.SENDER_PAY, SHIPPING_FEE_PAYMENT.RECEIVER_PAY]
        },
        isCOD: {
            type: DataTypes.BOOLEAN,
        },
        isGuaranteed: {
            type: DataTypes.BOOLEAN,
        },
        shippingFee: {
            type: DataTypes.FLOAT,
        },
        totalValue: {
            type: DataTypes.FLOAT,
        },
        recipientAmountPayment: {
            type: DataTypes.FLOAT,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
        },
    }, {
        sequelize,
        modelName: 'Orders',
    });
    return Orders;
};
