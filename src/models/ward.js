'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ward extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Ward.hasOne(models.District);
        }
    };
    Ward.init({
        name: DataTypes.STRING(128),
        type: DataTypes.STRING(32),
        districtId: DataTypes.UUID,
    }, {
        sequelize,
        modelName: 'Ward',
        createdAt: false,
        updatedAt: false
    });
    return Ward;
};
