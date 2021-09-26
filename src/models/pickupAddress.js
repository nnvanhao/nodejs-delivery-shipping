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
            PickupAddress.hasOne(models.user);
        }
    };
    PickupAddress.init({
        userId: DataTypes.UUID,
        address: DataTypes.STRING(128),
        phoneNumber: DataTypes.STRING(16),
        provinceId: DataTypes.UUID,
        districtId: DataTypes.UUID,
        wardId: DataTypes.UUID,
        isDefault: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'pickupaddress',
    });
    return PickupAddress;
};
