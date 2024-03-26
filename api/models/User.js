
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true,unique:true},
        cnic:{type:String,required:true,unique:true},
        phone:{type:String,required:true},
        profile: {type:String},
        password:{type:String,required:true},
        isAdmin:{
            type: Boolean,
            default: false,
        },
        isSuspended:{
            type: Boolean,
            default: false,
        },
        verified: { type: Boolean, default: false },
    },
    {timestamps: true}
);

module.exports = mongoose.model("User",UserSchema)