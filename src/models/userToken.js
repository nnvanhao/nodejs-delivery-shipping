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
        }
    };
    UserToken.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: DataTypes.UUID,
        token: DataTypes.STRING(1024),
        isExpired: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'UserToken',
        timestamps: true,
    });
    return UserToken;
};
