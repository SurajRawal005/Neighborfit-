import React from "react";

const NeighborhoodCard = ({ hood, onDelete, onEdit }) => {
  return (
    <div className="neighborhood-card">
      <h3>{hood.name || "Unnamed Neighborhood"}</h3>
      <p>{hood.city || "Unknown City"}</p>
      <p>Average Rent: ${hood.avgRent || 0}</p>
      <p>Crime Rate: {hood.crimeRate != null ? (hood.crimeRate * 100).toFixed(1) + "%" : "N/A"}</p>

      <div className="tags">
        {hood.lifestyleTags && hood.lifestyleTags.length > 0
          ? hood.lifestyleTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))
          : <span className="tag">No Tags</span>
        }
      </div>

      <div className="card-actions">
        <button type="button" onClick={() => onEdit(hood)}>
          ✏️ Edit
        </button>
        <button type="button" onClick={() => onDelete(hood._id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default NeighborhoodCard;
