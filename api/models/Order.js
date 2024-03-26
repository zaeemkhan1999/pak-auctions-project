const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
    {
        userId:{type:String, required:true},
        products:[
            {
                productId:{
                    type:String
                },
                quantity:{
                    type: Number,
                    default: 1,
                },
            },
        ],
        amount: {type: Number,require: true},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Order",OrderSchema);