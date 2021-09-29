const { Sequelize } = require('sequelize');
require('dotenv').config();
const { DB_NAME, USER_NAME, PASSWORD } = process.env;

// create connection pool
const sequelize = new Sequelize( DB_NAME, USER_NAME, PASSWORD, {
    dialect: 'postgres',
    logging: false
});


// testConnection(). Both syntax works
sequelize.authenticate()
    .then(() => console.log('Database connection successful!'))
    .catch( (e) => console.log('Error connecting to database: ', e));

// (async () => {
//     try {
//         sequelize.authenticate();
//         console.log('Database connection successful!');
//     } catch (e) {
//         console.log('Error connecting to database: ', e);
//     }
// })();

module.exports = sequelize;