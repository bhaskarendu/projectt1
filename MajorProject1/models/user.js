const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
//username and hash password is automatically defined by passport-local-mongoose
const userSchema = new Schema({
    email : {
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);//this creates username , hashing ,salting automatically
module.exports = mongoose.model("User" , userSchema);