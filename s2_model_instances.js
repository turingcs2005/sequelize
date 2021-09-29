const sequelize = require('./db/postgres');
const User = require('./models/user');

(async () => {
    await sequelize.sync({force: true});

    // create() combines build() and save()
    const jane = await User.create({ firstName: 'Jane', lastName: 'Doe' });  
    const tommy = await User.create({ firstName: 'Tommy', lastName: 'Smith' });
    
    // Model.create() returns an instance of User class
    console.log(jane instanceof User);                 

    // updating an instance)
    jane.lastName = 'Sanborn';
    console.log(jane.lastName); // 'Sanborn'

    // reload after update
    await jane.reload();
    console.log(jane.lastName); // 'Doe', because jane hasn't been saved, so 'Sanborn' is lost after reload.

    // now jane is saved to database with last name 'Sanborn'
    jane.lastName = 'Sanborn';
    await jane.save();

     // deleting an instance from database 
    await jane.destroy();                            


    // increment values
    await tommy.increment({                            
        age: 5,
        cash: 1e4
    });
    console.log(tommy.toJSON());
})();



