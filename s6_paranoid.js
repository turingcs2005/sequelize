const sequelize = require('./db/postgres');
const Saint = require('./models/saint');
const Hero = require('./models/hero');

(async () => {
    try {
        await sequelize.sync({force: true});
        
        const Peter = await Saint.create({ firstName: 'Peter', lastName: 'Saint' });
        const James = await Saint.create({ firstName: 'James', lastName: 'Saint'});

        const Spiderman = await Hero.create({firstName: 'Spider', lastName: 'Man'});
        const Ironman = await Hero.create({firstName: 'Iron', lastName: 'Man'});
        const Wonderwoman = await Hero.create({firstName: 'Wonder', lastName: 'Woman'});

        await Peter.setHero(Wonderwoman);
        await James.setHero(Ironman);

        // console.log((await Peter.getHero()).firstName);  // 'Wonder'

        // 🔥 reset Hero on Peter. Wonderwoman's SaintId is null; Spiderman has a SaintId pointing to Peter.
        await Peter.setHero(Spiderman);
        // console.log((await Peter.getHero()).firstName);  // 'Spider'

        // 🔥 Soft delete Spiderman: 'deletedAt' field now populated, and Spiderman still retains its 'SaintId' value.
        await Spiderman.destroy(
            // {
            //     force: true // 🔥 hard deletion (with force: true)
            // }
        );  // 🔥 soft deletion (without force: true)

        const heroes1= await Hero.findAll();
        // heroes1.forEach(x => { console.log(x.firstName )});  // 'Iron', 'Wonder' (Spiderman has been soft-destroyed) 

        Wonderwoman.reload();
        await Peter.setHero(Wonderwoman);                
        // console.log((await Peter.getHero()).firstName);  // 'Wonder'

        /* 🔥🔥🔥🔥🔥 restore Spiderman. 
        🔥 'deletedAt' field is now blank
        🔥 id is still 1
        🔥 Spiderman still points to Peter
        🔥 Spiderman is moved down!
        💩💩💩💩💩  Now we have both Spiderman and Wonderwoman points to Peter, but the association is one-to-one! */
        await Hero.restore({
            where: {
                firstName: 'Spider'
            }
        });

        const PeterHeroes = await Peter.getHero();
        // console.log(PeterHeroes.firstName);  // 'Wonder'. 
        // 💩💩💩 Even though Spiderman has been restored, getHero() returns Wonderwoman.

        await Wonderwoman.destroy();
        const PeterHeroes2 = await Peter.getHero();
        // console.log(PeterHeroes2.firstName); // 'Spider'.
        // 🔥🔥🔥 Now that Wonderwoman is destroyed, Peter is mapped to Spiderman 

        await Spiderman.destroy();
        await Hero.restore();  // restore both Wonderwoman and Spiderman

        // 💩💩💩💩💩 Somehow, Spiderman is above Wonderwoman and is returned. This is very confusing.
        console.log((await Peter.getHero()).firstName); // 'Spider'
        /* 😈 Be very careful when restoring soft-deleted items! Unintended consequences may arise. */

    } catch(e) {
        console.log('Error:', e);
    }
})();