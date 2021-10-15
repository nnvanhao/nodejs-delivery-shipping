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
            // address
            OrdersEvents.belongsTo(models.Province, { foreignKey: 'provinceId', as: 'provinceInfo' });
            OrdersEvents.belongsTo(models.District, { foreignKey: 'districtId', as: 'districtInfo' });
            OrdersEvents.belongsTo(models.Ward, { foreignKey: 'wardId', as: 'wardInfo' });
            //  status
            OrdersEvents.belongsTo(models.OrdersStatus, { foreignKey: 'ordersStatusId', as: 'statusInfo' });
            //  user updated
            OrdersEvents.belongsTo(models.User, { foreignKey: 'updateBy', as: 'updatedByUser' });
        }
    };
    OrdersEvents.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ordersStatusId: {
            type: DataTypes.UUID,
        },
        provinceId: {
            type: DataTypes.UUID,
        },
        districtId: {
            type: DataTypes.UUID,
        },
        wardId: {
            type: DataTypes.UUID,
        },
        ordersId: {
            type: DataTypes.UUID,
        },
        address: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING,
        },
        updateBy: {
            type: DataTypes.UUID,
        },
    }, {
        sequelize,
        modelName: 'OrdersEvents',
    });
    return OrdersEvents;
};
