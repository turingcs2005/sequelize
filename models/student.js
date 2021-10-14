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
        allowNull: false,
        // validation
        validate: {
            notEmpty: true, // empty string not allowed 
            isAlpha: true,  // only allows English letters
            len: [2, 256]   // max/min length
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
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
    modelName: 'Student',
    // model-wide validation: if you are under 18 years old, you are not allowed to have more than 10k cash
    validate: {
        cashLimit() {
            if ((this.age < 18) && (this.cash > 1e4)) {
                throw new Error('You are under 18 and are not allowed to have cash over 10k!');
            }
        }
    }
    // tableName: 'xxxx' 
});

module.exports = Student;