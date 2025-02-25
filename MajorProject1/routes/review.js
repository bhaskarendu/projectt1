const express = require("express");
const router = express.Router({mergeParams:true});
//here we have written mergeparmas:true because the paraent route "/listings/:id/reviews" which is in app.js does not gives its parameter id
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");





//FROM ROUTE DELETE THE COMMON PART WHICH IS IN ALL ROUTES IN A FILE THEN IN APP.JS USE MIDDLEWARE
//AND DEFINE IT THERE.

//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//delete route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports =router;
