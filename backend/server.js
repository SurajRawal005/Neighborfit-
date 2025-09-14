const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "neighborhoodDB";

async function main() {
  await client.connect();
  console.log("✅ Connected to MongoDB");

  const db = client.db(dbName);
  const neighborhoods = db.collection("neighborhoods");

  // GET all neighborhoods
  app.get("/api/neighborhoods", async (req, res) => {
    try {
      const data = await neighborhoods.find({}).toArray();
      const formatted = data.map((hood) => ({ ...hood, _id: hood._id.toString() }));
      res.json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch neighborhoods" });
    }
  });

  // GET single neighborhood by ID
  app.get("/api/neighborhoods/:id", async (req, res) => {
    try {
      const id = req.params.id;
      console.log("API requested ID:", id);

      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

      const hood = await neighborhoods.findOne({ _id: new ObjectId(id) });
      console.log("DB result:", hood);

      if (!hood) return res.status(404).json({ error: "Neighborhood not found" });

      res.json({ ...hood, _id: hood._id.toString() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch neighborhood" });
    }
  });

  // POST new neighborhood
  app.post("/api/neighborhoods", async (req, res) => {
    try {
      const { name, city, avgRent = 0, crimeRate = 0, lifestyleTags = [] } = req.body;
      if (!name || !city) return res.status(400).json({ error: "Name and city are required" });

      const result = await neighborhoods.insertOne({ name, city, avgRent, crimeRate, lifestyleTags });
      res.status(201).json({ _id: result.insertedId.toString(), name, city, avgRent, crimeRate, lifestyleTags });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add neighborhood" });
    }
  });

  // PUT update neighborhood
  app.put("/api/neighborhoods/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

      const { name, city, avgRent = 0, crimeRate = 0, lifestyleTags = [] } = req.body;

      // Only set the fields that are present in the request
      const updateFields = {};
      if (name) updateFields.name = name;
      if (city) updateFields.city = city;
      if (avgRent !== undefined) updateFields.avgRent = Number(avgRent);
      if (crimeRate !== undefined) updateFields.crimeRate = Number(crimeRate);
      if (lifestyleTags) updateFields.lifestyleTags = lifestyleTags;

      const result = await neighborhoods.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

      if (!result.value) return res.status(404).json({ error: "Neighborhood not found" });

      res.json({ ...result.value, _id: result.value._id.toString() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update neighborhood" });
    }
  });

  // DELETE neighborhood
  app.delete("/api/neighborhoods/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

      const result = await neighborhoods.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: "Neighborhood not found" });

      res.json({ message: "Neighborhood deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete neighborhood" });
    }
  });

  app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
}

main().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await client.close();
  console.log("🔒 MongoDB connection closed");
  process.exit(0);
});
