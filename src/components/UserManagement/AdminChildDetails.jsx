import { useState, useEffect, useRef } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdChildCare, MdCalendarToday } from "react-icons/md";
import { api } from "../../api";

const EMPTY = { title: "", description: "", name: "", dateOfBirth: "" };

const inp = "w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base font-medium focus:outline-none focus:border-[#45a578] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const dobRef = useRef(null);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const valid = form.title.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-[#45a578] px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Child</> : <><MdAdd /> Add Child</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
        </div>

        <div className="px-8 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Title *</label>
            <input className={inp} placeholder="e.g. Child Profile" value={form.title} onChange={f("title")} />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Description</label>
            <textarea className={`${inp} resize-none`} rows={3} placeholder="Short description..." value={form.description} onChange={f("description")} />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Child Name</label>
            <input className={inp} placeholder="e.g. Aarav Sharma" value={form.name} onChange={f("name")} />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Date of Birth</label>
            <div className="relative">
              <input ref={dobRef} type="date" className={`${inp} pr-14`}
                value={form.dateOfBirth ?? ""} onChange={f("dateOfBirth")} />
              <button type="button" onClick={() => dobRef.current?.showPicker?.()}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45a578]">
                <MdCalendarToday className="text-2xl" />
              </button>
            </div>
          </div>
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

const AdminChildDetails = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.childDetails.getAll();
      setEntries(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editEntry) await api.childDetails.update(editEntry._id, form);
      else await api.childDetails.create(form);
      setModalOpen(false);
      setEditEntry(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try { await api.childDetails.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#45a578] flex items-center justify-center shadow-lg shrink-0">
            <MdChildCare className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Child Details</h1>
            <p className="text-gray-500 text-base mt-1">Manage children profiles</p>
          </div>
        </div>
        <button onClick={() => { setEditEntry(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#3a9068] transition">
          <MdAdd className="text-2xl" /> Add Child
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-[#45a578] text-white">
            <tr>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">No</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Title</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Description</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Name</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Date of Birth</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-20 text-gray-400">
                <MdChildCare className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No children added yet.</p>
              </td></tr>
            ) : entries.map((e, i) => (
              <tr key={e._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-green-50/30 transition-colors`}>
                <td className="px-8 py-5 text-base text-gray-500">{i + 1}</td>
                <td className="px-8 py-5 text-base font-bold text-gray-800">{e.title}</td>
                <td className="px-8 py-5 text-base text-gray-600 max-w-xs truncate">{e.description || "—"}</td>
                <td className="px-8 py-5 text-base text-gray-600">{e.name || "—"}</td>
                <td className="px-8 py-5 text-base text-gray-600">{e.dateOfBirth || "—"}</td>
                <td className="px-8 py-5 text-center">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setEditEntry(e); setModalOpen(true); }}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(e._id)}
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

      {modalOpen && (
        <Modal entry={editEntry} onSave={handleSave} onClose={() => { setModalOpen(false); setEditEntry(null); }} saving={saving} />
      )}
    </div>
  );
};

export default AdminChildDetails;
