const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default : null,
            required: false,
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        message:{type:String, required:true},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Message",MessageSchema);