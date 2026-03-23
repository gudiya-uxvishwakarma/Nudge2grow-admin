import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdSchool, MdCheckCircle, MdStar } from "react-icons/md";
import { api } from "../../../api";

const LEVELS = ["Basic", "Intermediate", "Advanced"];
const inp = "w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-blue-500 transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry
    ? { ...entry, levels: entry.levels || LEVELS }
    : { name: "", type: "core", levels: [...LEVELS], isActive: true, isRecommended: false }
  );

  const toggleLevel = (l) =>
    setForm(p => ({ ...p, levels: p.levels.includes(l) ? p.levels.filter(x => x !== l) : [...p.levels, l] }));

  const valid = form.name.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-blue-500 px-7 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Core Area</> : <><MdAdd /> Add Core Area</>}
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
            <label className="block text-base font-bold text-gray-700 mb-2">Available Levels</label>
            <div className="flex gap-3">
              {LEVELS.map(l => (
                <button key={l} type="button" onClick={() => toggleLevel(l)}
                  className={`flex-1 py-3 rounded-xl text-base font-bold border-2 transition ${form.levels.includes(l) ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-400"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} className="w-5 h-5 accent-blue-500"
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
            className={`px-8 py-3 rounded-xl text-white text-base font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : entry ? "Update" : "Add Core Area"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CoreArea = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.customizeLearning.getAll();
      setItems((res.data || []).filter(i => i.type === "core"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const payload = { ...form, type: "core" };
      if (editItem) await api.customizeLearning.update(editItem._id, payload);
      else await api.customizeLearning.create(payload);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this core area topic?")) return;
    try { await api.customizeLearning.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
            <MdSchool className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-gray-800">Core Area</h1>
            <p className="text-gray-500 text-base mt-1">Manage core academic topics — {items.length} topics</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-500 text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-blue-600 transition">
          <MdAdd className="text-2xl" /> Add Core Area
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="px-6 py-5 font-bold uppercase tracking-wider text-base">Topic</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wider text-base">Levels</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wider text-base">Status</th>
              <th className="px-6 py-5 font-bold uppercase tracking-wider text-base text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-24 text-gray-400">
                <MdSchool className="text-7xl text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No core area topics yet.</p>
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50/30 transition-colors`}>
                <td className="px-6 py-5">
                  <div>
                    <p className="font-bold text-gray-800 text-base">{item.name}</p>
                    {item.isRecommended && <span className="text-sm text-amber-500 font-semibold flex items-center gap-1"><MdStar className="text-sm" /> Recommended</span>}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-1.5 flex-wrap">
                    {(item.levels || LEVELS).map(l => (
                      <span key={l} className={`text-sm font-bold px-2.5 py-1 rounded-full ${l === "Basic" ? "bg-green-100 text-green-600" : l === "Intermediate" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>{l}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 w-fit ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    <MdCheckCircle /> {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"><MdEdit /> Edit</button>
                    <button onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"><MdDelete /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

export default CoreArea;
