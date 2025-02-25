const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });





module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
         res.render("./listings/index.ejs",{allListings});
 };


 module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};



module.exports.showListing =async(req,res)=>{
    let {id}  = req.params;
    const listing=  await Listing.findById(id).populate({path : "reviews" , populate: {path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "Requested Listing does not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};







module.exports.createListing = async(req,res,next)=>{ 

    //converting locations into latitute and longitude 
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};

    newListing.geometry = response.body.features[0].geometry;

    let saved = await newListing.save();
    console.log(saved);

    req.flash("success" , "New Listing has been Added!!😊👍");
    res.redirect("/listings");
}







module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Requested Listing does not Exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    //by adding some parameter after upload in url , cloudinary changes its pixels , blurs image etc.
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};







module.exports.updateListing = async(req,res)=>{

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});//deconstructing the object req.body.listing and sending it for update
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url , filename };
    await listing.save();
    }
    req.flash("success" , "Listing has been Updated!!😊👍");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success" , "Listing has been Deleted!!👍");
    res.redirect("/listings");
};
