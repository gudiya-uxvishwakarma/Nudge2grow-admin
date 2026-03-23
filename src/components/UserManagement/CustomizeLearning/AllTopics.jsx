import { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdAutoAwesome,
  MdStar, MdCheckCircle
} from "react-icons/md";
import { api } from "../../../api";

const LEVELS = ["Basic", "Intermediate", "Advanced"];

const LEVEL_COLORS = {
  Basic: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", active: "bg-green-500" },
  Intermediate: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", active: "bg-yellow-500" },
  Advanced: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", active: "bg-red-500" },
};

const inp = "w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-[#45a578] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry
    ? { ...entry, levels: entry.levels || [...LEVELS] }
    : { name: "", levels: [...LEVELS], isActive: true, isRecommended: false }
  );

  const toggleLevel = (l) =>
    setForm(p => ({ ...p, levels: p.levels.includes(l) ? p.levels.filter(x => x !== l) : [...p.levels, l] }));

  const valid = form.name.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#45a578] px-7 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Topic</> : <><MdAdd /> Add Topic</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-7 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Topic Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Mathematics" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-3">Select Levels</label>
            <div className="flex gap-3">
              {LEVELS.map(l => {
                const c = LEVEL_COLORS[l];
                const selected = form.levels.includes(l);
                return (
                  <button key={l} type="button" onClick={() => toggleLevel(l)}
                    className={`flex-1 py-4 rounded-2xl text-base font-bold border-2 transition flex flex-col items-center gap-1 ${selected ? `${c.bg} ${c.text} ${c.border}` : "border-gray-200 text-gray-400 bg-gray-50"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? `${c.active} border-transparent` : "border-gray-300"}`}>
                      {selected && <MdCheckCircle className="text-white text-xs" />}
                    </div>
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} className="w-5 h-5 accent-[#45a578]"
                onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
              <span className="text-base font-semibold text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isRecommended} className="w-5 h-5 accent-amber-400"
                onChange={e => setForm(p => ({ ...p, isRecommended: e.target.checked }))} />
              <span className="text-base font-semibold text-gray-700">Recommended</span>
            </label>
          </div>
        </div>
        <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-3 rounded-xl text-white text-base font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#45a578] hover:bg-[#3a9068]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : entry ? "Update" : "Add Topic"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Single topic card — app-style
const TopicCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-[#45a578] to-[#3a9068]" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
            <MdAutoAwesome className="text-2xl text-[#45a578]" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
              {item.isActive ? "Active" : "Inactive"}
            </span>
            {item.isRecommended && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 flex items-center gap-1">
                <MdStar className="text-xs" /> Recommended
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-4">{item.name}</h3>

        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Levels</p>
          <div className="flex gap-2">
            {LEVELS.map(l => {
              const c = LEVEL_COLORS[l];
              const has = (item.levels || LEVELS).includes(l);
              return (
                <span key={l} className={`flex-1 text-center text-xs font-bold py-1.5 rounded-xl border ${has ? `${c.bg} ${c.text} ${c.border}` : "bg-gray-50 text-gray-300 border-gray-100"}`}>
                  {l}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-xl text-sm font-semibold transition">
            <MdEdit /> Edit
          </button>
          <button onClick={() => onDelete(item._id)}
            className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-semibold transition">
            <MdDelete /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AllTopics = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.customizeLearning.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.customizeLearning.update(editItem._id, form);
      else await api.customizeLearning.create(form);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this topic?")) return;
    try { await api.customizeLearning.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#45a578] to-[#3a9068] flex items-center justify-center shadow-lg shrink-0">
            <MdAutoAwesome className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">All Topics</h1>
            <p className="text-gray-500 text-base mt-1">Manage customize learning topics</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#3a9068] transition">
          <MdAdd className="text-2xl" /> Add Topic
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: "Total Topics", val: items.length, color: "text-[#45a578]", bg: "bg-green-50", icon: <MdAutoAwesome className="text-2xl" /> },
          { label: "Recommended", val: items.filter(i => i.isRecommended).length, color: "text-amber-500", bg: "bg-amber-50", icon: <MdStar className="text-2xl" /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">{s.label}</p>
              <p className="text-3xl font-bold text-gray-800">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Topic cards grid */}
      {items.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <MdAutoAwesome className="text-7xl text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium">No topics yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(item => (
            <TopicCard key={item._id} item={item}
              onEdit={(i) => { setEditItem(i); setModalOpen(true); }}
              onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

export default AllTopics;
