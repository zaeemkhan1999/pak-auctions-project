const mongoose = require("mongoose");
const BidSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true },
        date: { type: Date, required: true },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        maxAutoBid: {
            type: Number,
            default: null
          }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);