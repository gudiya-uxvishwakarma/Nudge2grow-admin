import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/grade";

const AdminGrade = () => {
  const [grades, setGrades] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ GET ALL
  const fetchGrades = async () => {
    try {
      const res = await axios.get(`${API}/geall`);
      setGrades(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${API}/update/${editId}`, { title });
        setEditId(null);
      } else {
        // CREATE
        await axios.post(`${API}/Post`, { title });
      }

      setTitle("");
      fetchGrades();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchGrades();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ EDIT
  const handleEdit = (grade) => {
    setTitle(grade.title);
    setEditId(grade._id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Grade Panel</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Grade (e.g. Grade 1)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-3">
        {grades.map((grade) => (
          <div
            key={grade._id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <span>{grade.title}</span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(grade)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(grade._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGrade;