const mongoose = require("mongoose");

const BabySchema = new mongoose.Schema({
    sessionList: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model("Baby", BabySchema);