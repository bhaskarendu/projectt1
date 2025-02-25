const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req,res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review has been Added!!😊👍");
    res.redirect(`/listings/${listing.id}`);
};


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
    //here $pull will find the review by reviewId and delete it
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review has been Deleted!!😊👍");
    res.redirect(`/listings/${id}`);
};