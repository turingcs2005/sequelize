const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');
const Dad = require('./dad');

class Buddy extends Model {
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
Buddy.init({
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    }
}, {
        sequelize,
        modelName: 'Buddy',
        tableName: 'Buddies'
});


// One-to-Many
Buddy.belongsTo(Dad, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});
Dad.hasMany(Buddy);

module.exports = Buddy;