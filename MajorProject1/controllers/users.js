const User = require("../models/user.js");




module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) =>{
    try{
    let{username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    // console.log(registeredUser);
    //req.login will automatically signin after signup
    req.login(registeredUser,(err) => {
        if(err){
            next(err);
        }
    req.flash("success" , "Welcome to HouseHub");
    res.redirect("/listings");
    });
    
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
};



module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};



module.exports.login = async(req,res) => {//passport.authenticate will check whether the user is a;ready registered or not
    req.flash("success","welcome back to HouseHub");
    // if(res.locals.redirectUrl){
    // res.redirect(res.locals.redirectUrl);
    // }
    // else{
    //     res.redirect("/listings");
    // }
    let redirectUrl = res.locals.redirectUrl || "/listings" ; //this line means if res.locals.redirectUrl is
    //empty then use /listings
    res.redirect(redirectUrl);
};




module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "Succesfully Logout");
        res.redirect("/listings");
    });
};