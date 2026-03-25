import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdLightbulb } from "react-icons/md";
import { api } from "../../api";

const EMPTY = { fact: "", prompt: "", source: "Britannica Kids", category: "", isActive: true };

const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#f6c572] focus:ring-4 focus:ring-[#f6c572]/20 transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-[#f6c572] px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <MdLightbulb /> {entry ? "Edit Fact" : "Add Did You Know"}
          </h2>
          <button onClick={onClose} className="text-gray-700 hover:bg-black/10 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Fact <span className="text-red-500">*</span></label>
            <textarea rows={3} className={`${inp} resize-none`}
              placeholder="Enter an interesting fact..." value={form.fact} onChange={f("fact")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Conversation Prompt</label>
            <textarea rows={2} className={`${inp} resize-none`}
              placeholder="e.g. Can you think of other foods that might not be what we usually call them?" value={form.prompt} onChange={f("prompt")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Source</label>
            <input className={inp} placeholder="e.g. Britannica Kids" value={form.source} onChange={f("source")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
            <input className={inp} placeholder="e.g. Science, History, Nature..." value={form.category} onChange={f("category")} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 accent-[#f6c572]" />
            <span className="text-sm font-semibold text-gray-700">Active (show in app)</span>
          </label>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => form.fact.trim() && onSave(form)} disabled={!form.fact.trim() || saving}
            className={`px-8 py-2.5 rounded-xl text-gray-800 text-sm font-bold transition shadow flex items-center gap-2 ${form.fact.trim() && !saving ? "bg-[#f6c572] hover:bg-[#e5b55f]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Fact"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDidYouKnow = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.didYouKnow.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.didYouKnow.update(editItem._id, form);
      else await api.didYouKnow.create(form);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fact?")) return;
    try { await api.didYouKnow.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f6c572] flex items-center justify-center shadow-md">
            <MdLightbulb className="text-gray-800 text-3xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Did You Know</h1>
            <p className="text-gray-500 text-base mt-0.5">Manage facts shown on the home screen — {items.length} facts</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#f6c572] text-gray-800 px-6 py-4 rounded-xl font-bold text-base shadow hover:bg-[#e5b55f] transition">
          <MdAdd className="text-xl" /> Add Fact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-400">
            <MdLightbulb className="text-6xl text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No facts yet. Add your first one!</p>
          </div>
        ) : items.map(item => (
          <div key={item._id} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm hover:border-[#f6c572]/50 transition">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#f6c572]/20 flex items-center justify-center shrink-0">
                <MdLightbulb className="text-[#b8860b] text-xl" />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-gray-800 text-sm font-medium leading-relaxed mb-2">{item.fact}</p>
            {item.prompt && (
              <div className="bg-blue-50 rounded-lg px-3 py-2 mb-2">
                <span className="text-xs font-bold text-blue-600">Prompt: </span>
                <span className="text-xs text-gray-600">{item.prompt}</span>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {item.source && <span className="text-xs text-gray-400 italic">Source: {item.source}</span>}
              {item.category && <span className="inline-block bg-[#f6c572]/20 text-[#b8860b] text-xs font-semibold px-2.5 py-1 rounded-full">{item.category}</span>}
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold transition">
                <MdEdit /> Edit
              </button>
              <button onClick={() => handleDelete(item._id)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition">
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

export default AdminDidYouKnow;
