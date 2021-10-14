const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');


class Foo extends Model {}
Foo.init({
    firstName: {
        type: DataTypes.STRING
    }
}, {
        sequelize,
        modelName: 'Foo'
});

class Bar extends Model {}
Bar.init({
    firstName: {
        type: DataTypes.STRING
    }
}, { 
    sequelize, 
    modelName: 'Bar'
});

/* One-to-one */
Foo.hasOne(Bar, {
    foreignKey: {
        allowNull: false   // you cannot create a Bar without associated Foo
    },
    onDelete: 'CASCADE',   
    onUpdate: 'CASCADE'

});
Bar.belongsTo(Foo);

module.exports = { Foo, Bar };    