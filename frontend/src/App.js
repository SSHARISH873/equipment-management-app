import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [equipments, setEquipments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "Machine",
    status: "Active",
    lastCleaned: ""
  });

  // Fetch all equipment from backend
  const fetchData = async () => {
    const res = await fetch("http://localhost:5001/api/equipment"); // updated port
    const data = await res.json();
    setEquipments(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5001/api/equipment", { // updated port
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", type: "Machine", status: "Active", lastCleaned: "" });
    fetchData();
  };

  // Delete equipment
  const deleteItem = async (id) => {
    await fetch(`http://localhost:5001/api/equipment/${id}`, { // updated port
      method: "DELETE"
    });
    fetchData();
  };

  return (
    <div className="container">
      <h1>Equipment Management</h1>

      <form className="equipment-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Machine</option>
          <option>Vessel</option>
          <option>Tank</option>
          <option>Mixer</option>
        </select>

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Under Maintenance</option>
        </select>

        <input
          type="date"
          required
          value={form.lastCleaned}
          onChange={(e) => setForm({ ...form, lastCleaned: e.target.value })}
        />

        <button type="submit">Add Equipment</button>
      </form>

      <div className="equipment-list">
        {equipments.map((eq) => (
          <div
            key={eq.id}
            className={`equipment-card ${eq.status
              .replace(" ", "-")
              .toLowerCase()}`}
          >
            <h3>{eq.name}</h3>
            <p>
              <strong>Type:</strong> {eq.type}
            </p>
            <p>
              <strong>Status:</strong> {eq.status}
            </p>
            <p>
              <strong>Last Cleaned:</strong> {eq.lastCleaned}
            </p>
            <button className="delete-btn" onClick={() => deleteItem(eq.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
