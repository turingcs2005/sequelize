const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');
const Kid = require('./kid');
const Dad = require('./dad');

class Mom extends Model {
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
Mom.init({
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    }
}, {
        sequelize,
        modelName: 'Mom',
        tableName: 'Moms'
});

/* 💩 You need to place pairs of hasMany(), hasOne(), belongsTo() in a single file.
   💩 You need to use both hasOne()/hasMany() and belongsTo(). */
// One-to-may
Mom.hasMany(Kid, {
    foreignKey: 'myMom'  // 💩 Custom foreign key needs to be declared in both hasMany() & belongsTo()
});
Kid.belongsTo(Mom, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    foreignKey: 'myMom'
});

// One-to-one
Mom.belongsTo(Dad, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});
Dad.hasOne(Mom);

module.exports = Mom;
