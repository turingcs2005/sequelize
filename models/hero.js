
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');
const Saint = require('./saint');

// define a model 
class Hero extends Model {}

// type, allowNUll, defaultValue 
Hero.init({
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
    modelName: 'Hero',
    paranoid: true // 🔥 paranoid table -> soft deletion
});

// One-to-one mapping between Saint and Hero, with SaintId saved in Hero table.
Hero.belongsTo(Saint);
Saint.hasOne(Hero);

module.exports = Hero;