'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserBank extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            UserBank.belongsTo(models.User);
        }
    };
    UserBank.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: DataTypes.UUID,
        name: DataTypes.STRING(128),
        branchName: DataTypes.STRING(128),
        holderName: DataTypes.STRING(128),
        number: DataTypes.STRING(64),
        isDefault: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'UserBank',
        timestamps: true,
    });
    return UserBank;
};
