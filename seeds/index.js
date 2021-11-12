const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 6;
        const camp = new Campground({
            // Your User ID
            author: '6116a7c9ad444312d0741c19',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, assumenda saepe nisi facilis qui deleniti odit officiis iure minima iste accusamus aliquam necessitatibus totam asperiores eveniet doloribus architecto repudiandae facere.',
            price: price,
            geometry: {
              "type": "Point", 
              "coordinates": [-113.1331, 47.0202] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/plvtinum/image/upload/v1630176994/YelpCamp/lwmo7ycszokzfpjapcnv.jpg',
                  filename: 'YelpCamp/lwmo7ycszokzfpjapcnv'
                },
                {
                  url: 'https://res.cloudinary.com/plvtinum/image/upload/v1630170046/YelpCamp/xfpzmosultjjoitajn02.jpg',
                  filename: 'YelpCamp/pooovu67mlqwdkncinr4'
                },
                {
                  url: 'https://res.cloudinary.com/plvtinum/image/upload/v1630162750/YelpCamp/zereewvhpzwjcrurcfg1.jpg',
                  filename: 'YelpCamp/zereewvhpzwjcrurcfg1'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})