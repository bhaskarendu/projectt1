const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash/lib/flash.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingContoller = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js")

//multer library is used to upload image

const multer  = require("multer");
const upload = multer({storage});



//Router.route hleps to keep code compact by cmbaining same routes

router
    .route("/")
    .get(wrapAsync(listingContoller.index))
    .post(isLoggedIn  , upload.single("listing[image]") , validateListing , wrapAsync(listingContoller.createListing));
    // .post(upload.single("listing[image]") , (req,res) => {
    //     res.send(req.file);
    // });




 //here we have kept "/listings/new" above "/listings/:id" as if we keep it below then node will treat new as id and try to search it which
 //will crash the app.  
 router.get("/new",isLoggedIn,listingContoller.renderNewForm);




router
    .route("/:id")
    .get(wrapAsync(listingContoller.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingContoller.updateListing))
    .delete(isLoggedIn, isOwner ,wrapAsync(listingContoller.destroyListing));




    

// //index route
// router.get("/",wrapAsync(listingContoller.index));






//  //SHOW ROUTE
//  //wrapAsync is used to handle errors and prevent server from crashing
// router.get("/:id",wrapAsync(listingContoller.showListing));


// //CREATE ROUTE
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingContoller.createListing));



//EDIT ROUTE
router.get("/:id/edit" , isLoggedIn ,isOwner , wrapAsync(listingContoller.renderEditForm));


// //update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingContoller.updateListing));



// //delete route
// router.delete("/:id",isLoggedIn, isOwner ,wrapAsync(listingContoller.destroyListing));


module.exports = router;