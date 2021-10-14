// One-to-One mapping: Dad.hasOne(Mom)
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');
const Mom = require('./mom');

class Dad extends Model {
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
Dad.init({
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    }
}, {
        sequelize,
        modelName: 'Dad',
        tableName: 'Dads'
});

module.exports = Dad;