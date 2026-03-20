import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdTrendingUp, MdTrendingDown, MdHome, MdMenuBook, MdTimer, MdChildCare, MdVisibility } from "react-icons/md";
import { api } from "../../api";

const getSharedSubjects = () => {
  try { return JSON.parse(localStorage.getItem("ls_sub_subjects")) || []; }
  catch { return []; }
};

const DURATIONS = ["5 min", "10 min", "12 min", "15 min", "20 min", "25 min", "30 min", "45 min"];

const EMPTY = { title: "", description: "", subject: "", duration: "", image: "" };

const SC = ({ label, value, change, up, color, icon }) => (
  <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${color}18` }}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-gray-800 leading-none">{value}</p>
      </div>
    </div>
    <span className="flex items-center gap-0.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
      {up ? <MdTrendingUp className="text-sm" /> : <MdTrendingDown className="text-sm" />}{change}
    </span>
  </div>
);

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const valid = form.title.trim() !== "";
  const sharedSubjects = getSharedSubjects();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {entry ? <><MdEdit /> Edit Nudge</> : <><MdAdd /> Add New Nudge</>}
            </h2>
            <p className="text-white/80 text-sm mt-0.5">Home Screen</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition"
              placeholder="e.g. The Water Cycle Adventure" value={form.title} onChange={f("title")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea rows={3} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition resize-none"
              placeholder="Short description…" value={form.description} onChange={f("description")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
            {sharedSubjects.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">No subjects yet. Add in Learning Subjects page first.</div>
            ) : (
              <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white"
                value={form.subject} onChange={f("subject")}>
                <option value="">Select subject…</option>
                {sharedSubjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
            <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white"
              value={form.duration} onChange={f("duration")}>
              <option value="">Select duration…</option>
              {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subject Image</label>
            <input type="file" accept="image/*"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00aa59] transition file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#00aa59] file:text-white hover:file:bg-[#008f4a] cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = 100; canvas.height = 100;
                    const ctx = canvas.getContext("2d");
                    const size = Math.min(img.width, img.height);
                    ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 100, 100);
                    setForm((p) => ({ ...p, image: canvas.toDataURL("image/jpeg", 0.7) }));
                  };
                  img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
              }} />
            {form.image && (
              <div className="mt-2 relative w-24 h-24">
                <img src={form.image} alt="preview" className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, image: "" }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition">
                  <MdClose />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : entry ? "Update" : "Add Nudge"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminHome = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [viewEntry, setViewEntry] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.home.getAll();
      const data = res.data || res || [];
      setEntries(data);
      localStorage.setItem("ls_sub_subjects", JSON.stringify(data));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditEntry(null); setModalOpen(true); };
  const openEdit = (e) => { setEditEntry(e); setModalOpen(true); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editEntry) {
        await api.home.update(editEntry._id, form);
      } else {
        await api.home.create(form);
      }
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed. Check console."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm("Delete this nudge?")) return;
    try {
      await api.home.remove(entry._id);
      await load();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Home Screen</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Manage today&apos;s nudges shown on the home screen</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-xl" /> Add Nudge
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <SC label="Total Nudges"    value={entries.length} change="+8%"  up={true} color="#00aa59" icon={<MdHome />} />
        <SC label="Active Subjects" value={[...new Set(entries.map(e => e.subject).filter(Boolean))].length} change="+2" up={true} color="#4F8EF7" icon={<MdMenuBook />} />
        <SC label="Avg Duration"    value={entries.length ? entries.filter(e => e.duration)[0]?.duration || "—" : "—"} change="+5%" up={true} color="#F6C72A" icon={<MdTimer />} />
        <SC label="Age Groups"      value="4" change="0%" up={true} color="#8B5CF6" icon={<MdChildCare />} />
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#00aa59] text-white text-sm">
              <th className="px-5 py-4 font-bold uppercase tracking-wider">Image</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider">Title</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider">Description</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider">Subject</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider">Duration</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-20 text-gray-400">
                <div className="flex flex-col items-center gap-3">
                  <MdInbox className="text-6xl text-gray-300" />
                  <p className="font-medium">No nudges yet</p>
                  <p className="text-sm">Click &quot;+ Add Nudge&quot; to create your first one</p>
                </div>
              </td></tr>
            ) : entries.map((entry, i) => (
              <tr key={entry._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                <td className="px-5 py-4">
                  {entry.image ? <img src={entry.image} alt="subject" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                    : <span className="text-gray-400 text-sm">—</span>}
                </td>
                <td className="px-5 py-4 font-semibold text-gray-800 text-sm max-w-[160px] truncate">{entry.title || "—"}</td>
                <td className="px-5 py-4 text-gray-500 text-sm max-w-[200px] truncate">{entry.description || "—"}</td>
                <td className="px-5 py-4">
                  {entry.subject ? <span className="bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-2.5 py-1 rounded-full">{entry.subject}</span>
                    : <span className="text-gray-400 text-sm">—</span>}
                </td>
                <td className="px-5 py-4 text-gray-600 text-sm">{entry.duration || "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setViewEntry(entry)} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdVisibility /> View</button>
                    <button onClick={() => openEdit(entry)} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdEdit /> Edit</button>
                    <button onClick={() => handleDelete(entry)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdDelete /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <Modal entry={editEntry} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}

      {viewEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><MdVisibility /> Nudge Details</h2>
                <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
              </div>
              <button onClick={() => setViewEntry(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                {viewEntry.image
                  ? <img src={viewEntry.image} alt="subject" className="w-16 h-16 rounded-xl object-cover border-2 border-[#00aa59]/30 shrink-0" />
                  : <div className="w-16 h-16 rounded-xl bg-[#00aa59]/10 flex items-center justify-center shrink-0"><MdHome className="text-3xl text-[#00aa59]" /></div>}
                <div>
                  <p className="font-extrabold text-gray-800 text-base leading-tight">{viewEntry.title || "—"}</p>
                  {viewEntry.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{viewEntry.description}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {viewEntry.subject && <span className="inline-flex items-center gap-1 bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200"><MdMenuBook className="text-sm" />{viewEntry.subject}</span>}
                {viewEntry.duration && <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200"><MdTimer className="text-sm" />{viewEntry.duration}</span>}
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewEntry(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
