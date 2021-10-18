const Saint = require('./models/saint');
const sequelize = require('./db/postgres');

(async () => {
    try {
        await sequelize.sync({force: true});
        
        await Saint.bulkCreate([
            { firstName: 'George', lastName: 'Washington' },
            { firstName: 'Martin', lastName: 'King' },
        ]);

        const Washington = await Saint.findOne({
            where: {
                lastName: 'Washington'
            }
        });

        const King = await Saint.findOne({
            where: {
                lastName: 'King'
            }
        });

        await Washington.destroy(
            // {
            //     force: true // 🔥 hard deletion (with force: true)
            // }
        );  // 🔥 soft deletion (without force: true)

        const list1 = await Saint.findAll();
        list1.forEach(x => { console.log(x.lastName )});  // 'King' (Washington was destroyed)

        await Saint.restore({   // 🔥 store deleted items
            where: {
                lastName: 'Washington'
            }
        });

        const list2 = await Saint.findAll();
        list2.forEach(x => { console.log(x.lastName) });  // 'King' and 'Washington'

    } catch(e) {
        console.log('Error:', e);
    }
})();