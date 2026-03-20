import { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/educational-board";

const PRESET_BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];

const boardColors = {
  CBSE: "bg-blue-50 border-blue-400 text-blue-800",
  ICSE: "bg-purple-50 border-purple-400 text-purple-800",
  "State Board": "bg-green-50 border-green-400 text-green-800",
  IB: "bg-yellow-50 border-yellow-400 text-yellow-800",
  Cambridge: "bg-red-50 border-red-400 text-red-800",
};

const getColor = (name) =>
  boardColors[name] || "bg-gray-50 border-gray-400 text-gray-800";

const AdminEducationalBoard = () => {
  const [boards, setBoards] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API}/getall`);
      setBoards(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameInput(val);
    if (val.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const addedNames = boards.map((b) => b.name.toLowerCase());
    const filtered = PRESET_BOARDS.filter(
      (b) =>
        b.toLowerCase().includes(val.toLowerCase()) &&
        !addedNames.includes(b.toLowerCase())
    );
    // Add "Other" if typed something not in presets
    const isPreset = PRESET_BOARDS.some(
      (b) => b.toLowerCase() === val.toLowerCase()
    );
    if (!isPreset) filtered.push("Other (custom)");
    setSuggestions(filtered);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === "Other (custom)") {
      // keep what user typed as custom name
      setShowDropdown(false);
    } else {
      setNameInput(suggestion);
      setShowDropdown(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const finalName = nameInput.trim();
    if (!finalName) return;
    try {
      if (editId) {
        await axios.put(`${API}/update/${editId}`, {});
        setEditId(null);
      } else {
        await axios.post(`${API}/post`, { name: finalName });
      }
      setNameInput("");
      fetchBoards();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (board) => {
    setEditId(board._id);
    setNameInput(board.name);
    setShowDropdown(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchBoards();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setNameInput("");
    setError("");
    setShowDropdown(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 text-gray-800">Educational Boards</h1>
      <p className="text-sm text-gray-500 mb-6">Add and manage educational boards</p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-8 space-y-4"
      >
        <p className="text-sm font-semibold text-gray-600">
          {editId ? (
            <>Editing: <span className="text-blue-600">{nameInput}</span></>
          ) : (
            "Add New Board"
          )}
        </p>

        {/* Name input with autocomplete */}
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Type board name (e.g. ICSE, IB...)"
            value={nameInput}
            onChange={handleNameChange}
            onFocus={() => nameInput.trim() && setShowDropdown(suggestions.length > 0)}
            disabled={!!editId}
            className="border border-gray-300 p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00bf62] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
              {suggestions.map((s) => (
                <li
                  key={s}
                  onMouseDown={() => handleSuggestionClick(s)}
                  className="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#00bf62] hover:text-white transition-colors"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="bg-[#00bf62] text-white px-6 py-2 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[#00a855] transition-colors"
          >
            {editId ? "Update" : "Add Board"}
          </button>
          {(editId || nameInput) && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Board list */}
      <div className="space-y-3">
        {boards.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🎓</p>
            <p className="text-sm">No boards added yet. Start typing above.</p>
          </div>
        )}
        {boards.map((board) => (
          <div
            key={board._id}
            className={`flex justify-between items-center border-2 rounded-2xl px-5 py-4 ${getColor(board.name)}`}
          >
            <div>
              <p className="font-bold text-base">{board.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(board)}
                className="bg-white/70 border border-current px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(board._id)}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
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

export default AdminEducationalBoard;
