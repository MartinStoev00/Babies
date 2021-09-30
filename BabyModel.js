const mongoose = require("mongoose");

const BabySchema = new mongoose.Schema({
    speed: {
        type: String,
        required: true,
    },
    time: { 
        type : String,
        require: true
    },
    day: {
        type: String,
        required: true 
    }
});

module.exports = mongoose.model("Baby", BabySchema);