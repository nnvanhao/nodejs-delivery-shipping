'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PickupAddress extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    PickupAddress.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: DataTypes.UUID,
        address: DataTypes.STRING(128),
        phoneNumber: DataTypes.STRING(16),
        provinceId: DataTypes.UUID,
        districtId: DataTypes.UUID,
        wardId: DataTypes.UUID,
        isDefault: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'PickupAddress',
        timestamps: true,
    });
    return PickupAddress;
};
