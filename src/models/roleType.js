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
            RoleType.belongsTo(models.UserRole, { foreignKey: 'id' }); 
        }
    };
    RoleType.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'RoleType',
        createdAt: false,
        updatedAt: false
    });
    return RoleType;
};
