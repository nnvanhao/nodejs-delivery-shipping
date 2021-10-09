'use strict';
const {
    Model
} = require('sequelize');
const { USER_STATUS, GENDER } = require('../constants/common.constant');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            User.hasOne(models.Customer);

            User.hasOne(models.UserRole);

            User.hasMany(models.UserToken);

            User.hasMany(models.UserBank);

            User.hasMany(models.PickupAddress);

            User.hasMany(models.PaymentTransaction);

        }
    };
    User.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        email: DataTypes.STRING(50),
        password: DataTypes.STRING, // default 255
        fullName: DataTypes.STRING(128),
        phoneNumber: DataTypes.STRING(16),
        emergencyPhone: DataTypes.STRING(16),
        gender: DataTypes.ENUM(GENDER.MALE, GENDER.FEMALE, GENDER.OTHER),
        status: {
            type: DataTypes.ENUM(USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.WAITING_VERIFY),
            defaultValue: USER_STATUS.WAITING_VERIFY
        },
        birthday: DataTypes.DATE,
        provinceId: DataTypes.UUID,
        districtId: DataTypes.UUID,
        wardId: DataTypes.UUID,
        address: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        code: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
