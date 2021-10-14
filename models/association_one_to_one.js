const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

/*
A.hasOne(B);      // A: source model; B: target model; one-to-one; foreign key defined in B (target)
A.belongsTo(B);   // one-to-one; foreign key defined in A (source)
A.hasMany(B);     // one-to-many; foreign key defined in B (obvious)
A.belongsToMany(B, {trough: 'C'}); // C: junction table; foreign keys (aId and bId) in C.
*/

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
    // 'CASCADE':  no orphan allowed. delete parents -> all children got deleted 
                // And descendents, too, if they also implement onDelete: 'CASCADE'
    // 'SET NULL': foreign key set to NULL when parent table row is deleted (orphan) 
    // 'RESTRICT' - parent cannot be deleted unless all children are deleted 
    // 'NO ACTION' - same as 'RESTRICT'
    // 'SET DEFAULT' - foreign key set to default value (foreign key must have default value definition)
});
Bar.belongsTo(Foo);

module.exports = { Foo, Bar };    