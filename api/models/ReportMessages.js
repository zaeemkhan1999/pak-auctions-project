const mongoose = require("mongoose");
const ReportMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        profile: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message:{type:String, required:true},
    },
    {timestamps: true}
);

module.exports = mongoose.model("ReportMessage",ReportMessageSchema);