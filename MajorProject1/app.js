if(process.env.NODE_ENV != "production"){ //this will ensure that credentials will not print if project is in production mode
require("dotenv").config();
}
// console.log(process.env.SECRET);





const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");

const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

// const mongo_url = "mongodb://localhost:27017/HouseHub";

const DB_URL = process.env.ATLASDB_URL;

async function main(){
    mongoose.connect(DB_URL);
}
main().then(res=>{
    console.log("connected to db");
}).catch(err=>{console.log(err)});





app.set("view engines","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));





const store = MongoStore.create({
    mongoUrl : DB_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});


store.on("error" , () => {
    console.log("ERROR IN MONGO SESSION STORE",err);
});


const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
};









app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    res.locals.currentUser = req.user;
    next();
});






app.get("/demouser" ,async(req,res) =>{
    let fakeuser = new User({
        email:"abc@hotmail.com",
        username : "abcdefg",
    });
    const registeredUser = await User.register(fakeuser, "this is password");
});





app.use("/listings",listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/",userRouter);










app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page is not available"));
})





//error handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{statusCode,message});
});






app.listen(port,()=>{
    console.log("app is listening on port",port);
});








