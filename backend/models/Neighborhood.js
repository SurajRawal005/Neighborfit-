const mongoose = require("mongoose");

const neighborhoodSchema = new mongoose.Schema({
  name: String,
  city: String,
  lifestyleTags: [String],
  avgRent: Number,
  crimeRate: Number
});

module.exports = mongoose.model("Neighborhood", neighborhoodSchema);
