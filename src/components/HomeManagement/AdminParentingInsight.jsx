import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdFavorite } from "react-icons/md";
import { api } from "../../api";

const EMPTY = { insight: "", tip: "", isActive: true };

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#e11d48] px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MdFavorite /> {entry ? "Edit Insight" : "Add Parenting Insight"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Insight <span className="text-red-500">*</span></label>
            <textarea rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#e11d48] focus:ring-4 focus:ring-[#e11d48]/10 transition resize-none"
              placeholder="Enter a parenting insight..." value={form.insight} onChange={f("insight")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Tip (optional)</label>
            <textarea rows={2} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#e11d48] focus:ring-4 focus:ring-[#e11d48]/10 transition resize-none"
              placeholder="Add a practical tip..." value={form.tip} onChange={f("tip")} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 accent-[#e11d48]" />
            <label htmlFor="isActive" className="text-base font-semibold text-gray-700">Active (show in app)</label>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => form.insight.trim() && onSave(form)} disabled={!form.insight.trim() || saving}
            className={`px-8 py-2.5 rounded-xl text-white text-base font-bold transition shadow flex items-center gap-2 ${form.insight.trim() && !saving ? "bg-[#e11d48] hover:bg-[#be123c]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Insight"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminParentingInsight = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.parentingInsights.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.parentingInsights.update(editItem._id, form);
      else await api.parentingInsights.create(form);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this insight?")) return;
    try { await api.parentingInsights.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#e11d48] flex items-center justify-center shadow-md">
            <MdFavorite className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Today's Parenting Insights</h1>
            <p className="text-gray-500 text-base mt-0.5">Manage parenting insights shown on the home screen</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#e11d48] text-white px-6 py-4 rounded-xl font-bold text-base shadow hover:bg-[#be123c] transition">
          <MdAdd className="text-xl" /> Add Insight
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-400">
            <MdFavorite className="text-6xl text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No insights yet. Add your first one!</p>
          </div>
        ) : items.map(item => (
          <div key={item._id} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm hover:border-[#e11d48]/30 transition">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#e11d48]/10 flex items-center justify-center shrink-0">
                <MdFavorite className="text-[#e11d48] text-xl" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <p className="text-gray-800 text-base font-medium leading-relaxed mb-2">{item.insight}</p>
            {item.tip && (
              <div className="bg-[#e11d48]/5 rounded-xl px-4 py-2.5 mb-3">
                <span className="text-sm font-bold text-[#e11d48] uppercase tracking-wide">Tip: </span>
                <span className="text-sm text-gray-600">{item.tip}</span>
              </div>
            )}
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

export default AdminParentingInsight;
