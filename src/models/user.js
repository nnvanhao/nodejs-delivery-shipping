'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            User.hasOne(models.province);

            User.hasOne(models.userrole);

            User.hasMany(models.usertoken);

            User.hasMany(models.userbank);

            User.hasMany(models.pickupaddress);

            User.hasMany(models.paymenttransaction);

        }
    };
    User.init({
        email: DataTypes.STRING(50),
        password: DataTypes.STRING, // default 255
        fullName: DataTypes.STRING(128),
        phoneNumber: DataTypes.STRING(16),
        gender: DataTypes.ENUM('Male', 'Female', 'Other'),
        birthday: DataTypes.DATE,
        provinceId: DataTypes.UUID,
        districtId: DataTypes.UUID,
        wardId: DataTypes.UUID,
        address: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'user',
    });
    return User;
};
