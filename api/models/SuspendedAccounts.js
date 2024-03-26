const mongoose = require("mongoose");
const SuspendAccountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason:{type:String, required:true},
        sdate:{type: Date},
        edate:{type: Date},
        lifetime:{type: Boolean,  required: true},
    },
    {timestamps: true}
);

module.exports = mongoose.model("SuspendAccount",SuspendAccountSchema);