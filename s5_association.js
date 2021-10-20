/*
Key mappings:
🌟 A.hasOne(B); 
    A: source model; B: target model; one-to-one; foreign key defined in B (target)
🌟 A.hasMany(B); 
    One-to-many; foreign key defined in B (obvious)
🌟 A.belongsTo(B); 
    One-to-one; foreign key defined in A (source)

We probably will not use:
⭐ A.belongsToMany(B, {trough: 'C'}); 
    C: junction table; foreign keys (aId and bId) in C.
*/

/* When change happens:
🌟 'CASCADE':  no orphan allowed. 
    - Delete parents -> all children got deleted 
    (And descendents, too, if they also implement onDelete: 'CASCADE')
    - Update parent's primary key -> update children's foreign key
🌟 'SET NULL': foreign key set to NULL when parent table row is deleted (orphan) 

We probably will not use:
⭐ 'RESTRICT' - parent cannot be deleted unless all children are deleted 
⭐ 'NO ACTION' - same as 'RESTRICT'
⭐ 'SET DEFAULT' - foreign key set to default value (foreign key must have default value definition)
*/

const Dad = require('./models/dad');
const Kid = require('./models/kid');
const Mom = require('./models/mom');
const Buddy = require('./models/buddy');

const sequelize = require('./db/postgres');

( async () => {
    try {
        await sequelize.sync({force: true});

        // create a bunch of mock data
        await Dad.bulkCreate([
            {firstName: 'James', lastName: 'Hsieh'},
            {firstName: 'John', lastName: 'Smith'},
        ]);

        await Mom.bulkCreate([
            {firstName: 'Susan', lastName: 'Hsieh', DadId: 1},
            {firstName: 'Claire', lastName: 'Smith', DadId: 2}
        ]);

        await Buddy.bulkCreate([
            {firstName: 'Tom', lastName: 'Marcotte', DadId: 1},
            {firstName: 'Jack', lastName: 'Sparrow', DadId: 1},
            {firstName: 'Kevin', lastName: 'Martin', DadId: 2}
        ]);

        await Kid.bulkCreate([
            {firstName: 'Joe', lastName: 'Hsieh', myMom: 1},
            {firstName: 'Erin', lastName: 'Hsieh', myMom: 1},
            {firstName: 'Ryan', lastName: 'Smith', myMom: 2},
        ]);

        //🔥 1. lazy loading a single instance
        /* SQL query without joins */
        const kid1 = await Kid.findOne({
            where: {
                lastName: 'Smith'
            }
        });

        const mom1 = await kid1.getMom(); // automatic method
        // console.log(mom1.lastName);  // 'Smith'

        //🔥 2. eager loading a single instance and an associated model
        /* SQL query with one or more joins */
        const kid2 = await Kid.findOne({
            where: {
                lastName: 'Hsieh'
            },
            include: Mom
        });

        // 🔥🔥🔥 3. eager loading all associated descendents
        const dad1 = await Dad.findOne({
            where: {
                lastName: 'Hsieh'
            },
            include: [{all: true, nested: true}]
        });

        // 🔥 4. eager loading sepcified descendents
        const dad2 = await Dad.findOne({
            attributes: ['firstName', 'lastName'],
            where: {
                lastName: 'Smith'
            },
            include: [
                {
                    model: Mom,
                    attributes: ['firstName', 'lastName'],
                    include: [
                        {
                            model: Kid,
                            attributes: ['firstName', 'lastName']
                        }
                    ]
                }, 
                {
                    model: Buddy,
                    attributes: ['firstName', 'lastName']
                }
            ]
        });

        // 💩💩💩 Official v6 documentation has a typo. Need to use uppercase Mom, not mom. 
        // console.log(kid2.Mom.firstName);        // 'Susan'
        // console.log(dad1.Mom.firstName);        // 'Susan'
        // console.log(dad1.Buddies[0].firstName); // 'Tom'
        // console.log(dad1.Mom.Kids[0].firstName);   // 'Erin' 💩 User has no control over order of kids.
        // console.log(dad2.Mom.Kids[0].firstName);   // 'Ryan'

        /* 5. instance methods: 
        🌟 get(), 
        🌟 set(), 
        🌟 create(), 
        🌟 count(), 
        🌟 has(), 
        🌟 add(), 
        🌟 remove() */

        const Joe = await Dad.create({firstName: 'Joe', lastName: 'Biden'});
        const Jill = await Mom.create({firstName: 'Jill', lastName: 'Biden'});
        const Mary = await Mom.create({firstName: 'Mary', lastName: 'Biden'});

        const Hunter = await Kid.create(
            {firstName: 'Hunter', lastName: 'Biden'}
        );
        const Beau = await Kid.create(
            {firstName: 'Beau', lastName: 'Biden'}
        );

        await Joe.setMom(Jill);  // associate Jill with Joe.

        // Here, Joe is an instance of Dad model. It has no knowledge of its associations unless you reload it.
        // console.log(Joe.Mom?.firstName);        // 'undefined', because Joe has no knowlege of Mom.

        await Joe.reload(
            { include: Mom }                     // would have been more efficient to include only what you need
            // { include: [{all: true, nested: true}] } // 🔥 reload and include all association hierarchies
        );
        // console.log(Joe.Mom?.firstName);        // 'Jill', because Joe is reloaded from database with Mom included.

        await Joe.setMom(null);                 // disassociate Jill and Joe in database. DadId for Jill is now 'null' 
        await Joe.reload();
        // console.log(Joe.Mom?.firstName);  // 'undefined', because Jill and Joe have been disassociated.

        await Joe.setMom(Mary);     // associate Mary with Joe.
        await Joe.reload();               // reload from database.    
        // console.log(Joe.Mom?.firstName);  // 'Mary', because we reloaded from database

        // 💩💩💩💩💩 have to reload. otherwise seqelize thought there is no change to Jill. Joe.setMom() changed Jill.
        await Jill.reload();            
        await Joe.setMom(Jill);  // associate Jill with Joe.
        await Joe.reload();
        // console.log(Joe.Mom?.firstName);   // 'Jill'

        /* 🔥 For one-to-one associations, you can use either party to get the other party */
        let m = await Joe.getMom(); 
        // console.log(m.firstName);  // 'Jill'

        let d = await Jill.getDad();
        // console.log(d.firstName); // 'Joe'
        
        /* One-to-many mapping */
        // 🔥 Note the plural form 'Kids' used in one-to-many mapping
        await Jill.setKids([Hunter, Beau]);  
        await Jill.reload({
            include: [
                { model: Kid },
                { model: Dad }
            ]
        });

        // 🔥 You can access 'Kids' property directly (if kids are already loaded from database), 
        //  or use getKids() function to load from database.
        // Jill.Kids.forEach(x => console.log(x.firstName) );  // 'Hunter', 'Beau'
        
        const k = await Jill.getKids();
        // k.map(k => k.firstName).forEach(x => console.log(x));   // 'Hunter', 'Beau'
        // console.log(Jill.Dad?.firstName);    // 'Joe'

        // count kids (if kids have already been loaded from database)
        // console.log(Jill.Kids.length);         // 2
        // count kids from database 
        // console.log(await Jill.countKids());   // 2

        // 🔥 nested include: load all 3 hierarchies 
        await Joe.reload({
            include: [
                {
                    model: Mom,
                    include: [
                        {
                            model: Kid
                        }
                    ]
                }
            ]
        });

        // console.log(Joe.Mom.Kids[0].firstName);   // 'Hunter'

        // 🔥 mapping functions for one-to-many mapping
        // 💩💩💩💩💩 Official documentation uses has() on one-to-one mapping. It does not work.
        // console.log(await Jill.hasKids(Hunter));     // 'true'
        // console.log(await Jill.hasKids([Hunter, Beau]))  // 'true'

        // 🔥 set multiple kids
        const Ashley = await Kid.create({
            firstName: 'Ashley', lastName: 'Biden'
        });

        /* 💩💩💩 Please note the plural form of the noun: setKids(), not setKid(). 
        For one-to-one mapping, use setKid(). */
        await Jill.setKids([Hunter, Beau, Ashley]);
        // console.log(Jill.Kids.length);           // 2. Jill in memory has not been updated yet
        // console.log(await Jill.countKids());     // 3

        await Jill.reload();
        // Jill.Kids.forEach(x => console.log(x.firstName));  // Hunter, Beau, Ashley

        // 🔥 add a new kid from mom: you can create instances from its parent instance
        const Naomi = await Kid.create({
            firstName: 'Naomi', lastName: 'Biden'
        });
        await Jill.addKids([Naomi]);
        // console.log(await Jill.countKids());    // 4

        await Jill.removeKids([Hunter, Ashley]);
        // console.log(await Jill.countKids());       // 2

        // 🔥 eager loading with inner join: required 
        const Putin = await Dad.create({ firstName: 'Putin', lastName: 'Vladimir'});
        const marriedDadsWithBuddies = await Dad.findAll({
            include: [
                {
                    model: Mom,
                    required: true
                },
                {
                    model: Buddy,
                    required: true
                }
            ]
        });

        // marriedDadsWithBuddies.forEach(x => console.log(x.firstName));  // 'James', 'John'

        // 🔥 eager loading filtered at the associated model level
        const BeausDads = await Dad.findAll({
            include: {
                model: Mom,
                where: {
                    firstName: 'Jill'
                }
            }
        });

        BeausDads.forEach(x => {
            console.log(x.firstName, x.lastName, x.Mom?.firstName, x.Mom?.lastName);  // Joe Biden Jill Biden
        });

    } catch(e) {
        console.log('Error:', e);
    }
}
)();
