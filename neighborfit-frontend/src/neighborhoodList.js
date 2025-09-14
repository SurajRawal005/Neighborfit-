import React, { useState } from "react";
import NeighborhoodCard from "./NeighborhoodCard";
import NeighborhoodModal from "./NeighborhoodModal";
import { useNavigate } from "react-router-dom";

const NeighborhoodList = ({ neighborhoods, onDelete, onAdd }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const openAddModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleSave = async (hood) => {
    try {
      const res = await fetch("http://localhost:5000/api/neighborhoods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hood),
      });
      if (!res.ok) throw new Error("Failed to add");
      const savedHood = await res.json();
      onAdd(savedHood);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("⚠️ Error saving neighborhood");
    }
  };

  const handleEdit = (hood) => navigate(`/edit/${hood._id}`);

  const filtered = neighborhoods.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="neighborhoods-section">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={openAddModal}>➕ Add Neighborhood</button>
      </div>

      {filtered.length > 0 ? (
        <div className="neighborhood-grid">
          {filtered.map((hood) => (
            <NeighborhoodCard
              key={hood._id}
              hood={hood}
              onDelete={onDelete}
              onEdit={() => handleEdit(hood)}
            />
          ))}
        </div>
      ) : (
        <p>No neighborhoods found.</p>
      )}

      {modalVisible && (
        <NeighborhoodModal show={modalVisible} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
};

export default NeighborhoodList;
