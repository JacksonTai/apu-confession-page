const mongoose = require("mongoose");
const path = require('path');
const { readFileSync } = require('fs')

const Confession = require('../models/confessions')

const dbUrl = 'mongodb://localhost:27017/apucp';
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Database connected: ${dbUrl} `);
    seedDB()
}).catch((e) => {
    console.log(e);
});

const seedDB = async () => {
    try {
        console.log('Seeding Database ...')
        await Confession.deleteMany({});
        let confessions = JSON.parse(readFileSync(path.join(__dirname, "confessions.json")))
        for (let confession of confessions) {
            const newConfession = new Confession(confession);
            await newConfession.save();
        }
        console.log('Database Seeding Completed - ✔️')
    } catch (error) {
        console.error(error);
    }
}