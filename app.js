const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");


 const MONGO_URL="mongodb://127.0.0.1:27017/wanderstay";

main()
.then(()=>{
    console.log("db connected");
})
.catch((err)=>{
console.log(err);
});

async function main(){
 await mongoose.connect(MONGO_URL); 
 }

 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.urlencoded({extended:true}));// for params
 app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 app.use(express.static(path.join(__dirname,"/public")));

 app.get("/",(req,res)=>{
    res.send("i am root");
 });

 // index route
 app.get("/listings",wrapAsync(async(req,res)=>{// id is supplied form here to all other routes
    const allListings=await Listing.find({});// fetchin from the db
    res.render("listings/index.ejs",{allListings});
 }));


 
 // new route
app.get("/listings/new",(req,res)=>{
      res.render("listings/new.ejs");
 });


 // show route
 app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
 }));

 // create
app.post("/listings",wrapAsync(async (req,res,next)=>{
     if(!listing){
      throw new ExpressError(400,"invalid listing data");
     }
      const newListing= new Listing(req.body.listing);// creates the new instance
      await newListing.save();
      res.redirect("/listings");
     
}));

// edit route

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id);
      res.render("listings/edit.ejs",{listing});

}));

//update route

   app.put("/listings/:id",wrapAsync(async(req,res)=>{

      if(!listing){
      throw new ExpressError(400,"invalid listing data");
       }

          let {id}=req.params;
         await Listing.findByIdAndUpdate(id,{...req.body.listing});//...req.body.listing , this will deconstruct the object form the edit.ejs
         res.redirect(`/listings/${id}`);
   }));

   // delete route

   app.delete("/listings/:id",wrapAsync(async(req,res)=>{
          let {id}=req.params;
         await Listing.findByIdAndDelete(id);
         res.redirect("/listings");
   }));

  app.all("/{*splat}", (req, res, next) => {
         next(new ExpressError(404, "Page not found"));
});


   // erroe handling

   app.use((err,req,res,next)=>{
      // error catching middleware
      let {statusCode=500, message="something went wrong"}=err;

      res.status(statusCode).render("error.ejs",{message});
      //res.status(statusCode).send(message);
   });




 
//  app.get("/testListing",async(req,res)=>{
//        let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price: 1200,
//         loaction:"goa, mumbai",
//         country:"india",
//        });

//       await sampleListing.save();
//        console.log("saved donee");
//        res.send("sucess");
//  });

 app.listen(8080,()=>{
console.log("server is listening ");

 });