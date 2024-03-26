const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: false,
        },
        comment:{type:String, required:true},
        date:{type: Date},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Comments",CommentSchema);