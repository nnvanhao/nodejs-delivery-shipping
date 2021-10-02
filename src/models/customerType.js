'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CustomerType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            CustomerType.belongsTo(models.Customer, { foreignKey: 'id' }); 
        }
    };
    CustomerType.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'CustomerType',
        createdAt: false,
        updatedAt: false
    });
    return CustomerType;
};
