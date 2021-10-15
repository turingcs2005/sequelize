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

const sequelize = require('./db/postgres');

( async () => {
    try {
        await sequelize.sync({force: true});

        await Dad.bulkCreate([
            {firstName: 'James', lastName: 'Hsieh'}
        ]);

        await Mom.bulkCreate([
            {firstName: 'Sue', lastName: 'Hsieh', DadId: 1},
            {firstName: 'Claire', lastName: 'Smith'}
        ]);

        await Kid.bulkCreate([
            {firstName: 'Joe', lastName: 'Hsieh', MomId: 1},
            {firstName: 'Ryan', lastName: 'Smith', MomId: 2},
        ]);
    } catch(e) {
        console.log('Error:', e);
    }
}
)();

// test