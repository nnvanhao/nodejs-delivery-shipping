'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrdersStatus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    OrdersStatus.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
        sortIndex: DataTypes.INTEGER,
        required: DataTypes.BOOLEAN,
        requiredTakePicture: DataTypes.BOOLEAN,
        key: DataTypes.STRING,
        color: DataTypes.STRING,
        allowEmployee: DataTypes.BOOLEAN,
        isDeleted: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'OrdersStatuses',
    });
    return OrdersStatus;
};
