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

const Kid = require('./models/kid');
const Mom = require('./models/mom');
const Dad = require('./models/dad');
const sequelize = require('./db/postgres');

( async () => {
    try {
        await sequelize.sync({force: true});
        Mom.bulkCreate([
            {firstName: 'Sue', lastName: 'Hsieh'},
            {firstName: 'Claire', lastName: 'Smith'}
        ]);

        Dad.bulkCreate([

        ])

        Kid.bulkCreate([
            {firstName: 'Joe', lastName: 'Hsieh'},
            {firstName: 'Ryan', lastName: 'Smith'},
        ]);
    } catch(e) {
        console.log('Error:', e);
    }
}
)();
