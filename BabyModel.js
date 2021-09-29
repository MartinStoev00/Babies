const mongoose = require("mongoose");

const BabySchema = new mongoose.Schema({
    speed: {
        type: String,
        required: true,
    },
    time: { 
        type : Date,
        require: true
    },
    timeframe: {
        type: String,
        required: true 
    }
});

module.exports = mongoose.model("Baby", BabySchema);