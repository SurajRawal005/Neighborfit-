import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NeighborhoodList from "./neighborhoodList";
import EditNeighborhood from "./EditNeighborhood";
import "./App.css";

function App() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNeighborhoods = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/neighborhoods");
      const data = await res.json();
      setNeighborhoods(data);
    } catch {
      setError("⚠️ Failed to fetch neighborhoods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const handleAddNeighborhood = (newNeighborhood) => {
    setNeighborhoods((prev) => [...prev, newNeighborhood]);
  };

  const handleUpdateNeighborhood = (updatedNeighborhood) => {
    setNeighborhoods((prev) =>
      prev.map((hood) =>
        hood._id === updatedNeighborhood._id ? updatedNeighborhood : hood
      )
    );
  };

  const handleDeleteNeighborhood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this neighborhood?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/neighborhoods/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNeighborhoods((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert("⚠️ Failed to delete neighborhood");
      }
    } catch {
      alert("⚠️ Error deleting neighborhood");
    }
  };

  if (isLoading) return <p className="loading">Loading neighborhoods...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <Router>
      <Routes>
        {/* Home/List Page */}
        <Route
          path="/"
          element={
            <div className="App">
              {/* Stats Section */}
              <section className="stats-section">
                <div className="stat-card">
                  <h3>🏙️ {neighborhoods.length}</h3>
                  <p>Total Neighborhoods</p>
                </div>

                <div className="stat-card">
                  <h3>
                    💰 $
                    {neighborhoods.length > 0
                      ? Math.round(
                          neighborhoods.reduce((sum, n) => sum + (n.avgRent || 0), 0) /
                            neighborhoods.length
                        )
                      : 0}
                  </h3>
                  <p>Avg Rent</p>
                </div>

                <div className="stat-card">
                  <h3>
                    🛡️{" "}
                    {neighborhoods.length > 0
                      ? (
                          neighborhoods.reduce((sum, n) => sum + (n.crimeRate || 0), 0) /
                          neighborhoods.length
                        ).toFixed(1)
                      : "0"}
                    /10
                  </h3>
                  <p>Avg Safety Index</p>
                </div>
              </section>

              <main className="main-content">
                <section className="list-section">
                  <NeighborhoodList
                    neighborhoods={neighborhoods}
                    onDelete={handleDeleteNeighborhood}
                    onAdd={handleAddNeighborhood}
                  />
                </section>
              </main>
            </div>
          }
        />

        {/* Edit Page */}
        <Route
          path="/edit/:id"
          element={<EditNeighborhood onUpdate={handleUpdateNeighborhood} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
