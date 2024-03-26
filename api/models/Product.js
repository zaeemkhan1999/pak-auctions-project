const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
        title:{type:String, required:true},

        desc:{type:String, required:true},
        
        categories:{type:String,required: true},

        price:{type:Number,required:true},
        
        sdate:{type: Date,required:true},
        
        edate:{type: Date,required:true},
        userId:{type:String,required:true},
        image:{type:Array},
        emailflag:{type:Boolean,default:false},
        // img : {
        //     data : Buffer,
        //     contentType: String
        // },
 
    },
    {timestamps: true}
);

module.exports = mongoose.model("Product",ProductSchema);