'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class District extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            District.hasMany(models.ward);
        }
    };
    District.init({
        name: DataTypes.STRING(128),
        type: DataTypes.STRING(32),
        provinceId: DataTypes.UUID,
    }, {
        sequelize,
        modelName: 'district',
    });
    return District;
};
