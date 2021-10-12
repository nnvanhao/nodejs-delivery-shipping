'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrdersEvents extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of DataTypes lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    OrdersEvents.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
        },
        orderStatusId: {
            type: DataTypes.STRING,
        },
        provinceId: {
            type: DataTypes.STRING,
        },
        districtId: {
            type: DataTypes.STRING,
        },
        wardId: {
            type: DataTypes.STRING,
        },
        orderId: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING,
        },
        updateBy: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        modelName: 'OrdersEvents',
    });
    return OrdersEvents;
};
