'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Province.hasMany(models.District);
            // Province.belongsTo(models.User);
        }
    };
    Province.init({
        name: DataTypes.STRING(128),
        code: DataTypes.STRING(3),
        type: DataTypes.STRING(32),
        shortName: DataTypes.STRING(32)
    }, {
        sequelize,
        modelName: 'Province',
        createdAt: false,
        updatedAt: false
    });
    return Province;
};
