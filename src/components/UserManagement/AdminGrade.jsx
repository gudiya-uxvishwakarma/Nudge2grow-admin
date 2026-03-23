import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdSchool } from "react-icons/md";
import { api } from "../../api";

const AdminGrade = () => {
  const [grades, setGrades] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.grades.getAll();
      setGrades(res.data || res || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (editId) {
        await api.grades.update(editId, { title });
        setEditId(null);
      } else {
        await api.grades.create({ title });
      }
      setTitle("");
      load();
    } catch (err) { console.error(err); alert("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grade?")) return;
    try { await api.grades.remove(id); load(); }
    catch (err) { console.error(err); }
  };

  const handleEdit = (grade) => { setTitle(grade.title); setEditId(grade._id); };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00bf62] to-[#00a055] flex items-center justify-center shadow-lg shrink-0">
          <MdSchool className="text-white text-4xl" />
        </div>
        <div>
          <h1 className="text-5xl font-semibold text-gray-800">Grade Management</h1>
          <p className="text-gray-500 text-base mt-1">Add and manage grades for the app</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-600 mb-5">{editId ? "Edit Grade" : "Add New Grade"}</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. Grade 1, Grade 2..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#00bf62] focus:ring-4 focus:ring-[#00bf62]/10 transition"
            required
          />
          <button type="submit"
            className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-3 rounded-xl text-base font-bold transition shadow">
            {editId ? <><MdSave /> Update</> : <><MdAdd /> Add</>}
          </button>
          {editId && (
            <button type="button" onClick={() => { setTitle(""); setEditId(null); }}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-3 rounded-xl text-base font-semibold transition">
              <MdClose /> Cancel
            </button>
          )}
        </form>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {grades.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-400">
            <MdSchool className="text-7xl text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No grades yet. Add one above.</p>
          </div>
        ) : grades.map((grade) => (
          <div key={grade._id}
            className="bg-white rounded-2xl border-2 border-gray-100 px-6 py-5 flex flex-col gap-4 shadow-sm hover:border-[#00bf62]/30 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00bf62]/10 flex items-center justify-center shrink-0">
                <MdSchool className="text-[#00bf62] text-2xl" />
              </div>
              <span className="font-bold text-gray-800 text-xl break-words min-w-0">{grade.title}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(grade)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1">
                <MdEdit /> Edit
              </button>
              <button onClick={() => handleDelete(grade._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1">
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGrade;
