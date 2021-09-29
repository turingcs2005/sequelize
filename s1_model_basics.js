const sequelize = require('./db/postgres');
const User = require('./models/user');
// const Student = require('./models/student');

(async () => {
    try {
        await User.drop();                    // drop table (Users) associated with model User
        
        /* Drop all tables associated with this sequelize instance, i.e. call drop() on each imported model.
           Here, Student is not affected because it is not imported. */
        await sequelize.drop();
        
        await User.sync({force: true});       // sync a single table (Users)
        await sequelize.sync({force: true});  // sync all models

        const u1 = User.build({ firstName: 'Claire', lastName: 'Wang'});     // build an unsaved instance of model 
        await u1.save();                                                     // save the instance
        console.log(u1.fullName);
        
        // create() combines build() and save().
        await User.create({ firstName: 'Maggie', lastName: 'Collins'});      
    } catch (e) {
        console.log(e);
    }
}) ();




