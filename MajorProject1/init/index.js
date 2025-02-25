const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(res=>{
    console.log("connected to db");
}).catch(err=>{console.log(err)});

async function main(){
    await mongoose.connect("mongodb://localhost:27017/HouseHub");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj , owner : "66a0cc6adadf7d6aa0c6982b"}));
    //map object does not changes the arrow instead it creates new array therfore we are storing the new adat in same old data initdata.data
    initdata.data = initdata.data.map((obj) => ({...obj , geometry: { type: 'Point', coordinates: [ 77.208773, 28.613927 ] }}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
};

initDB();