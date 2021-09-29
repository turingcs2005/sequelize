const sequelize = require('./db/postgres');
const User = require('./models/user');
const { Op } = require('sequelize');   // operators

/* sequelize CRUD operations */



( async () => {
    await User.sync({force: true});

    // 1. insert: create(); bulkCreate()
    await User.bulkCreate(
        [
            {firstName: 'Jane', lastName: 'Sanborn'},
            {firstName: 'Tommy',  lastName: 'Smith'},
            {firstName: 'Sue', lastName: 'Sanborn'}
        ]
    );

    // 2. select: findAll(), findOne()
    // select all: findAll() 
    // returns an array of Model instances
    const users = await User.findAll();
    console.log(users.length);
    users.forEach(x => console.log(x.lastName));
    console.log(users.every(x => x.lastName === 'Sanborn')); 

    // select attributes
    // you can use 
    // 1. array of attribute names
    // 2. include: for calculated fields
    // 3. exclude: to exclude columns
    const names = await User.findAll({
        attributes: ['lastName', 'firstName']
    });
    names.map(x => x.dataValues).forEach(x => {console.log(x)});

    // operators: and, or, gt, gte, lt, lte, is, not, or, between, notBetween, reqexp, etc.
    const firstNames = await User.findAll({
        attributes: ['firstName'],
        where: {
            [Op.and]: [
                {lastName: 'Sanborn'},
                {firstName: 'Jane'}
            ]
        }
    });

    firstNames.map(x => x.dataValues).forEach(x => {console.log(x.firstName)});
    
    // query with functions 
    const adv = await User.findAll({
        attributes: ['firstName'], 
        where: sequelize.where(sequelize.fn('char_length', sequelize.col('lastName')), 5)
    })

    adv.map(x => x.dataValues).forEach(x => {console.log(x.firstName)});

    // findOne() finds one item 
    const u = await User.findOne({
        attributes: ['firstName'],
        where: {lastName: 'Smith'},
        order: [ ['createdAt', 'DESC'] ]
    });
    console.log(u.dataValues.firstName);  // 

    // 3. update: update()
    await User.update( {lastName: 'Price'}, {
        where: {
            lastName: 'Smith'
        }
    });

    // 4. delete: destroy()
    await User.destroy({
        where: {
            firstName: 'Tommy'
        }
    });

})();

// other convenience functions such as count, max, min, sum
