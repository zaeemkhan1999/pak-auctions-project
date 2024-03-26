const mongoose = require("mongoose");
const AlertSchema = new mongoose.Schema(
    {
        email:{type:String,required:true},
        product:{type:String},
        categories:{type:String},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Alert",AlertSchema);