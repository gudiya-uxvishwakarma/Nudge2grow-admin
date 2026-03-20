import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdVisibility, MdImage, MdTrendingUp } from "react-icons/md";
import { api } from "../../api";

const StatCard = ({ label, value, change, color, icon }) => (
  <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${color}18`, color }}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 leading-none">{value}</p>
      </div>
    </div>
    <span className="flex items-center gap-0.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
      <MdTrendingUp className="text-sm" />{change}
    </span>
  </div>
);

const EMPTY = { title: "", titleColor: "#45a578", description: "" };

const AdminIntroScreen = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [viewSlide, setViewSlide] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.introSlides.getAll();
      setSlides(res.data || res || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm({ ...EMPTY }); setModal({ id: null }); };
  const openEdit = (slide) => { setForm({ ...slide }); setModal({ id: slide._id }); };
  const close    = () => setModal(null);

  const handleSave = async () => {
    if (!form.title?.trim()) return;
    setSaving(true);
    try {
      if (modal.id) {
        await api.introSlides.update(modal.id, form);
      } else {
        await api.introSlides.create(form);
      }
      close();
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await api.introSlides.remove(id);
      await load();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Intro Management</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Manage your app intro slides</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-xl" /> Add Slide
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatCard label="Total Slides"  value={slides.length} change="+12%" color="#00bf62" icon={<MdImage />} />
        <StatCard label="Profile Views" value="513"           change="+15%" color="#4F8EF7" icon={<MdVisibility />} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest w-12">Number</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-16 text-gray-400">
                <div className="flex flex-col items-center gap-3">
                  <MdInbox className="text-5xl text-gray-300" />
                  <p className="font-medium text-sm">No slides yet</p>
                  <p className="text-xs">Click &quot;+ Add Slide&quot; to create your first one</p>
                </div>
              </td></tr>
            ) : slides.map((slide, i) => (
              <tr key={slide._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                <td className="px-6 py-4 text-gray-400 text-sm">{i + 1}</td>
                <td className="px-6 py-4">
                  <span className="font-extrabold text-base tracking-wide" style={{ color: slide.titleColor || "#45a578" }}>{slide.title}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{slide.description || "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setViewSlide(slide)} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdVisibility /> View</button>
                    <button onClick={() => openEdit(slide)} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdEdit /> Edit</button>
                    <button onClick={() => handleDelete(slide._id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdDelete /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                {modal.id ? <><MdEdit /> Edit Slide</> : <><MdAdd /> Add Slide</>}
              </h2>
              <button onClick={close} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <div className="flex gap-3 items-center">
                  <input type="text" value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. NUDGE2GROW"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition"
                    style={{ color: form.titleColor || "#45a578" }} />
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <input type="color" value={form.titleColor || "#45a578"} onChange={(e) => setForm((p) => ({ ...p, titleColor: e.target.value }))}
                      className="w-11 h-11 rounded-xl border-2 border-gray-200 cursor-pointer p-0.5" title="Pick title color" />
                    <span className="text-xs text-gray-400">Color</span>
                  </div>
                </div>
                {form.title && (
                  <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">App Preview:</p>
                    <p className="text-2xl font-extrabold tracking-wide" style={{ color: form.titleColor || "#45a578" }}>{form.title}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Write the subtitle/description for this slide..." rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition resize-none" />
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={close} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
              <button onClick={handleSave} disabled={!form.title?.trim() || saving}
                className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${form.title?.trim() && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
                <MdSave /> {saving ? "Saving…" : modal.id ? "Update" : "Add Slide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewSlide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-white">View Slide</h2>
                <p className="text-white/70 text-xs mt-0.5">Read-only details</p>
              </div>
              <button onClick={() => setViewSlide(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="bg-gray-50 rounded-2xl px-6 py-5 text-center border border-gray-100">
                <p className="text-3xl font-extrabold tracking-wide mb-2" style={{ color: viewSlide.titleColor || "#45a578" }}>{viewSlide.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{viewSlide.description || "—"}</p>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase w-24 shrink-0">Title Color</span>
                <span className="w-6 h-6 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: viewSlide.titleColor || "#45a578" }} />
                <span className="text-sm text-gray-600 font-mono">{viewSlide.titleColor || "#45a578"}</span>
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewSlide(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIntroScreen;
