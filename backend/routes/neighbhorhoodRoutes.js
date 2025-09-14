const express = require("express");
const Neighborhood = require("../models/Neighborhood");

const router = express.Router();

// Get all neighborhoods
router.get("/", async (req, res) => {
  const neighborhoods = await Neighborhood.find();
  res.json(neighborhoods);
});

// Match neighborhoods by preferences
router.post("/match", async (req, res) => {
  const { preferences } = req.body; // array of tags

  let neighborhoods = await Neighborhood.find();

  // Scoring logic
  neighborhoods = neighborhoods.map(nb => {
    let score = 0;
    preferences.forEach(pref => {
      if (nb.lifestyleTags.includes(pref)) score++;
    });
    return { ...nb._doc, score };
  });

  // Sort by score (highest first)
  neighborhoods.sort((a, b) => b.score - a.score);

  res.json(neighborhoods);
});

module.exports = router;
