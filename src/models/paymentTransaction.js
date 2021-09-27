'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PaymentTransaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    PaymentTransaction.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        code: DataTypes.STRING(32),
        userBankId: DataTypes.UUID,
        userId: DataTypes.UUID,
        amount: DataTypes.DECIMAL,
        paymentDate: DataTypes.DATE,
        status: DataTypes.STRING(64),
        note: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'PaymentTransaction',
        timestamps: true,
    });
    return PaymentTransaction;
};
