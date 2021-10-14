const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');
const Kid = require('./Kid');
const Dad = require('./Dad');

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

Mom.hasMany(Kid);
Mom.belongsTo(Dad, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    foreignKey: 'myHusbandId'
});

module.exports = Mom;
