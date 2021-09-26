'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            UserToken.hasOne(models.user);
        }
    };
    UserToken.init({
        userId: DataTypes.UUID,
        token: DataTypes.STRING(1024),
        isExpired: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'usertoken',
    });
    return UserToken;
};
