import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditNeighborhood = ({ onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hood, setHood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHood = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/neighborhoods/${id}`);
        const data = await res.json();
        setHood(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHood();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/neighborhoods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hood),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updatedHood = await res.json();
      onUpdate(updatedHood);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("⚠️ Error updating neighborhood");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!hood) return <p>Neighborhood not found</p>;

  return (
    <div className="edit-page">
      <h1>Edit Neighborhood</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            value={hood.name}
            onChange={(e) => setHood({ ...hood, name: e.target.value })}
          />
        </label>
        <label>
          City:
          <input
            value={hood.city}
            onChange={(e) => setHood({ ...hood, city: e.target.value })}
          />
        </label>
        <label>
          Avg Rent:
          <input
            type="number"
            value={hood.avgRent || ""}
            onChange={(e) =>
              setHood({ ...hood, avgRent: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Safety Index:
          <input
            type="number"
            value={hood.crimeRate || ""}
            onChange={(e) =>
              setHood({ ...hood, crimeRate: Number(e.target.value) })
            }
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditNeighborhood;
