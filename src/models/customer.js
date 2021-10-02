'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Customer.belongsTo(models.CustomerType);
        }
    };
    Customer.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: DataTypes.UUID,
        customerTypeId: DataTypes.UUID,
    }, {
        sequelize,
        modelName: 'Customer',
        createdAt: false,
        updatedAt: false
    });
    return Customer;
};
