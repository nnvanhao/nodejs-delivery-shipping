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

      User.hasOne(models.Province);

      User.hasOne(models.UserRole);

      User.hasMany(models.UserToken);

      User.hasMany(models.UserBank);

      User.hasMany(models.PickupAddress);

      User.hasMany(models.PaymentTransaction);

    }
  };
  User.init({
    email: DataTypes.STRING(50),
    password: DataTypes.STRING, // default 255
    fullName: DataTypes.STRING(128),
    phoneNumber: DataTypes.STRING(16),
    gender: DataTypes.ENUM('Male','Female','Other'),
    birthday: DataTypes.DATE,
    provinceId: DataTypes.UUID,
    districtId: DataTypes.UUID,
    wardId: DataTypes.UUID,
    address: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};