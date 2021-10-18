const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

// define a model 
class Saint extends Model {}

// type, allowNUll, defaultValue 
Saint.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Saint',
    paranoid: true // 🔥 paranoid table -> soft deletion
});

module.exports = Saint;