import { useEffect, useState, useRef } from "react";
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdSchool } from "react-icons/md";
import { api } from "../../api";

const PRESET_BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];

const boardColors = {
  CBSE: "border-blue-400 bg-blue-50 text-blue-800",
  ICSE: "border-purple-400 bg-purple-50 text-purple-800",
  "State Board": "border-green-400 bg-green-50 text-green-800",
  IB: "border-yellow-400 bg-yellow-50 text-yellow-800",
  Cambridge: "border-red-400 bg-red-50 text-red-800",
};
const getColor = (name) => boardColors[name] || "border-gray-300 bg-gray-50 text-gray-800";

const AdminEducationalBoard = () => {
  const [boards, setBoards] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.educationalBoards.getAll();
      setBoards(res.data || res || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameInput(val);
    if (!val.trim()) { setSuggestions([]); setShowDropdown(false); return; }
    const added = boards.map(b => b.name.toLowerCase());
    const filtered = PRESET_BOARDS.filter(b =>
      b.toLowerCase().includes(val.toLowerCase()) && !added.includes(b.toLowerCase())
    );
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSuggestionClick = (s) => { setNameInput(s); setShowDropdown(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const finalName = nameInput.trim();
    if (!finalName) return;
    try {
      if (editId) {
        await api.educationalBoards.update(editId, { name: finalName });
        setEditId(null);
      } else {
        await api.educationalBoards.create({ name: finalName });
      }
      setNameInput("");
      load();
    } catch (err) { setError(err.response?.data?.message || "Something went wrong"); }
  };

  const handleEdit = (board) => { setEditId(board._id); setNameInput(board.name); setShowDropdown(false); };
  const handleCancel = () => { setEditId(null); setNameInput(""); setError(""); setShowDropdown(false); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this board?")) return;
    try { await api.educationalBoards.remove(id); load(); }
    catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00bf62] to-[#00a055] flex items-center justify-center shadow-lg shrink-0">
          <MdSchool className="text-white text-4xl" />
        </div>
        <div>
          <h1 className="text-5xl font-semibold text-gray-800">Educational Boards</h1>
          <p className="text-gray-500 text-base mt-1">Add and manage educational boards for the app</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-600 mb-5">{editId ? "Edit Board" : "Add New Board"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Type board name (e.g. CBSE, ICSE...)"
              value={nameInput}
              onChange={handleNameChange}
              onFocus={() => nameInput.trim() && setShowDropdown(suggestions.length > 0)}
              className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-[#00bf62] focus:ring-4 focus:ring-[#00bf62]/10 transition"
            />
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                {suggestions.map(s => (
                  <li key={s} onMouseDown={() => handleSuggestionClick(s)}
                    className="px-5 py-3 text-base cursor-pointer hover:bg-[#00bf62] hover:text-white transition-colors">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && <p className="text-red-500 text-base">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={!nameInput.trim()}
              className="flex items-center gap-2 bg-[#00bf62] hover:bg-[#00a055] text-white px-6 py-3 rounded-xl text-base font-bold transition disabled:opacity-40">
              {editId ? <><MdSave /> Update</> : <><MdAdd /> Add Board</>}
            </button>
            {(editId || nameInput) && (
              <button type="button" onClick={handleCancel}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-3 rounded-xl text-base font-semibold transition">
                <MdClose /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {boards.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MdSchool className="text-7xl text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No boards added yet.</p>
          </div>
        ) : boards.map(board => (
          <div key={board._id}
            className={`flex justify-between items-center border-2 rounded-2xl px-6 py-5 ${getColor(board.name)}`}>
            <div className="flex items-center gap-4">
              <MdSchool className="text-2xl" />
              <span className="font-bold text-xl">{board.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(board)}
                className="bg-white/70 border border-current px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white transition flex items-center gap-1">
                <MdEdit /> Edit
              </button>
              <button onClick={() => handleDelete(board._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition flex items-center gap-1">
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEducationalBoard;
