import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdSelfImprovement } from "react-icons/md";
import { api } from "../../api";

const DEFAULT_OPTIONS = [
  "Christian", "Hindu", "Muslim", "Buddhist", "Jewish", "Sikh", "Other", "Prefer not to say"
];

const inp = "w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base font-medium focus:outline-none focus:border-[#45a578] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry
    ? { name: entry.name, isActive: entry.isActive ?? true, order: entry.order ?? 0 }
    : { name: "", isActive: true, order: 0 }
  );
  const valid = form.name.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#45a578] px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Option</> : <><MdAdd /> Add Option</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
        </div>
        <div className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Faith / Background Name *</label>
            <input className={inp} placeholder="e.g. Christian, Hindu, Muslim..." value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Display Order</label>
            <input type="number" className={inp} value={form.order}
              onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} className="w-5 h-5 accent-[#45a578]"
              onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
            <span className="text-base font-semibold text-gray-700">Active (show in app)</span>
          </label>
        </div>
        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-3 rounded-xl text-white text-base font-bold flex items-center gap-2 transition ${valid && !saving ? "bg-[#45a578] hover:bg-[#3a9068]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminFaithBackground = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.faithBackground.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.faithBackground.update(editItem._id, form);
      else await api.faithBackground.create(form);
      setModalOpen(false);
      setEditItem(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this option?")) return;
    try { await api.faithBackground.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#45a578] flex items-center justify-center shadow-lg shrink-0">
            <MdSelfImprovement className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Faith Background</h1>
            <p className="text-gray-500 text-base mt-1">Manage faith/background options shown during child setup</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#3a9068] transition">
          <MdAdd className="text-2xl" /> Add Option
        </button>
      </div>

      {/* Info banner */}
      {items.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6 text-amber-800 text-sm font-medium">
          No options in database yet. The app currently uses these defaults: {DEFAULT_OPTIONS.join(", ")}. Add them here to manage them from the admin panel.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-[#45a578] text-white">
            <tr>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">No</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Name</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Order</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Status</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-20 text-gray-400">
                <MdSelfImprovement className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No faith options yet. Add your first one!</p>
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-green-50/30 transition-colors`}>
                <td className="px-8 py-5 text-base text-gray-500">{i + 1}</td>
                <td className="px-8 py-5 text-base font-bold text-gray-800">{item.name}</td>
                <td className="px-8 py-5 text-base text-gray-500">{item.order}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdDelete /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => { setModalOpen(false); setEditItem(null); }} saving={saving} />}
    </div>
  );
};

export default AdminFaithBackground;
