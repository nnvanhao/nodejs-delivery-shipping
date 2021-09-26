'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoleType.hasOne(models.UserRole);
    }
  };
  RoleType.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RoleType',
  });
  return RoleType;
};