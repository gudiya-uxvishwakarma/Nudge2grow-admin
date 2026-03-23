import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdVisibility, MdSlideshow } from "react-icons/md";
import { api } from "../../api";

const TITLE_COLORS = [
  { label: "Green", value: "#45a578" },
  { label: "Orange", value: "#FF8C42" },
  { label: "Blue", value: "#2B7FD9" },
  { label: "Pink", value: "#FF69B4" },
];

const inp = "w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base font-medium focus:outline-none focus:border-[#00aa59] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState({
    title: entry?.title ?? "",
    titleColor: entry?.titleColor ?? "#45a578",
    description: entry?.description ?? "",
  });

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));
  const valid = form.title.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-[#00aa59] px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Slide</> : <><MdAdd /> Add Slide</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
        </div>

        <div className="px-8 py-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Title *</label>
            <input className={inp} style={{ color: form.titleColor }} value={form.title} onChange={f("title")} placeholder="Enter slide title..." />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-700 mb-3">Title Color</label>
            <div className="flex flex-wrap gap-3">
              {TITLE_COLORS.map(c => (
                <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, titleColor: c.value }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition ${form.titleColor === c.value ? "border-gray-800 scale-105" : "border-transparent"}`}
                  style={{ backgroundColor: c.value + "22", color: c.value }}>
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.value }} />
                  {c.label}
                </button>
              ))}
              <input type="color" value={form.titleColor} onChange={f("titleColor")} className="w-12 h-12 rounded-lg border-2 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Description</label>
            <textarea rows={4} className={`${inp} resize-none`} value={form.description} onChange={f("description")} placeholder="Enter description..." />
          </div>
        </div>

        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 text-base border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-3 rounded-xl text-white text-base font-bold flex items-center gap-2 transition ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewModal = ({ slide, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><MdVisibility /> View Slide</h2>
        <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
      </div>
      <div className="px-8 py-6 space-y-4">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-3xl font-extrabold mb-3" style={{ color: slide.titleColor }}>{slide.title}</p>
          {slide.description && <p className="text-base text-gray-600 leading-relaxed">{slide.description}</p>}
        </div>
      </div>
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
      </div>
    </div>
  </div>
);

const AdminIntroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [viewSlide, setViewSlide] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.introSlides.getAll();
      setSlides(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editSlide) await api.introSlides.update(editSlide._id, form);
      else await api.introSlides.create(form);
      setModalOpen(false);
      setEditSlide(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try { await api.introSlides.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#00aa59] flex items-center justify-center shadow-lg shrink-0">
            <MdSlideshow className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Intro Slides</h1>
            <p className="text-gray-500 text-base mt-1">Manage onboarding intro slides</p>
          </div>
        </div>
        <button onClick={() => { setEditSlide(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-2xl" /> Add Slide
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-[#00aa59] text-white">
            <tr>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider">No</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider">Title</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider">Description</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-20 text-gray-400">
                <MdSlideshow className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No slides yet. Add your first one!</p>
              </td></tr>
            ) : slides.map((s, i) => (
              <tr key={s._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-green-50/30 transition-colors`}>
                <td className="px-8 py-5 text-base text-gray-500">{i + 1}</td>
                <td className="px-8 py-5 text-base font-bold" style={{ color: s.titleColor }}>{s.title}</td>
                <td className="px-8 py-5 text-base text-gray-600 max-w-xs truncate">{s.description || "—"}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setViewSlide(s)}
                      className="flex items-center gap-1.5 bg-[#00aa59] hover:bg-[#008f4a] text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdVisibility /> View
                    </button>
                    <button onClick={() => { setEditSlide(s); setModalOpen(true); }}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(s._id)}
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

      {modalOpen && <Modal entry={editSlide} onSave={handleSave} onClose={() => { setModalOpen(false); setEditSlide(null); }} saving={saving} />}
      {viewSlide && <ViewModal slide={viewSlide} onClose={() => setViewSlide(null)} />}
    </div>
  );
};

export default AdminIntroSlides;
