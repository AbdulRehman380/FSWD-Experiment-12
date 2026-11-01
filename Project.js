
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    stack: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
