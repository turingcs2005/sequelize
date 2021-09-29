const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

// define a model 
class Student extends Model {
    static species = 'homo sapien';  // a class property
    
    get fullName() {    // a getter
        return this.firstName + ' ' + this.lastName; 
    }
}

// type, allowNUll, defaultValue 
Student.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nationality: {
        type: DataTypes.STRING,
        defaultValue: 'U.S.A.'
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: 20
    },
    cash: {
        type: DataTypes.INTEGER,
        defaultValue: 1e4
    }
}, {
    sequelize,
    modelName: 'Student'
    // tableName: 'xxxx' 
});

module.exports = Student;