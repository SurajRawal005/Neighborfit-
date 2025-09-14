import React, { useState, useEffect } from "react";

const NeighborhoodModal = ({ show, onClose, onSave, initialData = null }) => {
  const [hoodData, setHoodData] = useState({
    name: "",
    city: "",
    avgRent: 0,
    crimeRate: 0,
    lifestyleTags: [],
  });
  const [newTag, setNewTag] = useState("");

  // Initialize modal data
  useEffect(() => {
    if (initialData) {
      console.log("Modal loaded with initialData:", initialData); // debug
      setHoodData({ ...initialData }); // include _id!
    } else {
      setHoodData({ name: "", city: "", avgRent: 0, crimeRate: 0, lifestyleTags: [] });
    }
    setNewTag("");
  }, [initialData, show]);

  if (!show) return null;

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setHoodData((prev) => ({
      ...prev,
      lifestyleTags: [...prev.lifestyleTags, newTag.trim()],
    }));
    setNewTag("");
  };

  const handleRemoveTag = (tag) => {
    setHoodData((prev) => ({
      ...prev,
      lifestyleTags: prev.lifestyleTags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = () => {
    if (!hoodData.name.trim() || !hoodData.city.trim()) {
      alert("⚠️ Name and City are required");
      return;
    }
    onSave(hoodData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{initialData ? "Edit Neighborhood" : "Add Neighborhood"}</h3>

        <label>Name:</label>
        <input
          type="text"
          value={hoodData.name}
          onChange={(e) => setHoodData({ ...hoodData, name: e.target.value })}
        />

        <label>City:</label>
        <input
          type="text"
          value={hoodData.city}
          onChange={(e) => setHoodData({ ...hoodData, city: e.target.value })}
        />

        <label>Average Rent:</label>
        <input
          type="number"
          value={hoodData.avgRent}
          onChange={(e) =>
            setHoodData({ ...hoodData, avgRent: parseInt(e.target.value) || 0 })
          }
        />

        <label>Crime Rate (%):</label>
        <input
          type="number"
          step="0.1"
          value={hoodData.crimeRate * 100}
          onChange={(e) =>
            setHoodData({
              ...hoodData,
              crimeRate: parseFloat(e.target.value) / 100 || 0,
            })
          }
        />

        <label>Lifestyle Tags:</label>
        <div className="tags-edit">
          {hoodData.lifestyleTags.map((tag) => (
            <span key={tag} className="tag">
              {tag}{" "}
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                x
              </button>
            </span>
          ))}
        </div>

        <div className="add-tag">
          <input
            type="text"
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={handleAddTag}>
            Add-Tag
          </button>
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit}>{initialData ? "Save" : "Add"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodModal;
