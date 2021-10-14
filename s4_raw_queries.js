const sequelize = require('./db/postgres');
const { QueryTypes } = require('sequelize');

// sequelize.query() for raw SQL queries
// 💩 1. SQL query syntax differs by dialect, e.g. Postgresql query != Microsoft SQL query.
// 💩 2. SQL query return objects != sequelize return object.
// 💩 3. Due to absence of model, type check is not possible. You get warning when accessing property.
( async () => {
    try {
        const users = await sequelize.query('SELECT * FROM public."Users"', { type: QueryTypes.SELECT });
        console.log(users[0]);  // returns an array of user objects. There is no dataValue property
        users.forEach(x => {console.log(x.lastName)});
    } catch(e) {
        console.log('Error happened:', e);
    }
})();