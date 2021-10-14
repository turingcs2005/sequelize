// One-to-many mapping: Mom.hasMany(Kid)
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');
const Mom = require('./Mom');

class Kid extends Model {
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
Kid.init({
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    }
}, {
        sequelize,
        modelName: 'Kid',
        tableName: 'Kids'
});

Kid.belongsTo(Mom, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    foreignKey: 'myKidId'
});
