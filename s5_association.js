const sequelize = require('./db/postgres');
const { Foo, Bar } = require('./models/association_one_to_one');

( async () => {
    try {
        await sequelize.sync({force: true});
    } catch(e) {
        console.log('Error:', e);
    }
}
)();
