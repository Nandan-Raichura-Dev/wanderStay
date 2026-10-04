const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const listingSchema=new Schema({// schema
    title:{
        
       type: String,

       required:true,
    
    }
    
    ,
    description:String,
    image: {
        filename: String,
        url: {
            type: String,
            set: (v) => (v === "" ? "defaultLink" : v),
        },
    },// usl
    price:Number,
    location:String,
    country:String,

})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;