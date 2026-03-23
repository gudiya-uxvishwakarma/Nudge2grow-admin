import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdStar, MdVisibility } from "react-icons/md";
import { api } from "../../../api";

const EMPTY = { name: "", role: "", rating: "5", text: "", photo: "" };

const compressPhoto = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 80; canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const size = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 80, 80);
      cb(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const TestimonialModal = ({ entry, onSave, onClose }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const valid = form.name.trim() !== "" && form.text.trim() !== "";

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    compressPhoto(file, (dataUrl) => setForm((p) => ({ ...p, photo: dataUrl })));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Testimonial</> : <><MdAdd /> Add Testimonial</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#00aa59]/30 bg-gray-100 flex items-center justify-center shrink-0">
              {form.photo
                ? <img src={form.photo} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-gray-400">{form.name?.charAt(0)?.toUpperCase() || "?"}</span>
              }
            </div>
            <label className="cursor-pointer bg-[#00aa59]/10 hover:bg-[#00aa59]/20 text-[#00aa59] text-sm font-semibold px-4 py-2 rounded-xl transition border border-[#00aa59]/30">
              {form.photo ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            {form.photo && (
              <button type="button" onClick={() => setForm((p) => ({ ...p, photo: "" }))} className="text-sm text-red-400 hover:text-red-600 transition">Remove Photo</button>
            )}
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Priya Sharma" value={form.name} onChange={f("name")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Role</label>
            <input className={inp} placeholder="e.g. Mother of Child" value={form.role} onChange={f("role")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Rating</label>
            <select className={inp} value={form.rating} onChange={f("rating")}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Review Text <span className="text-red-500">*</span></label>
            <textarea rows={4} className={`${inp} resize-none`} placeholder="Write the review…" value={form.text} onChange={f("text")} />
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button disabled={!valid} onClick={() => valid && onSave(form)}
            className={`px-8 py-2.5 rounded-xl text-white text-base font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {entry ? "Update" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [viewTest, setViewTest] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.testimonials.getAll(); setTestimonials(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    try {
      if (editEntry) await api.testimonials.update(editEntry._id, form);
      else await api.testimonials.create(form);
      setModal(false); setEditEntry(null); await load();
    } catch (e) { console.error(e); alert("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try { await api.testimonials.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shrink-0">
            <MdStar className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Testimonials</h1>
            <p className="text-gray-500 text-base mt-1">Manage user reviews and testimonials</p>
          </div>
        </div>
        <button onClick={() => { setEditEntry(null); setModal(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-2xl" /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">No.</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Name</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Role</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Rating</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Review</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-20 text-gray-400">
                <MdInbox className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No testimonials yet. Add your first one!</p>
              </td></tr>
            ) : testimonials.map((t, i) => (
              <tr key={t._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5 transition-colors`}>
                <td className="px-5 py-4 text-gray-400 text-base">{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-[#00aa59] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {t.photo ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" /> : t.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="font-semibold text-gray-800 text-base">{t.name || "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500 text-base">{t.role || "—"}</td>
                <td className="px-5 py-4">
                  <span className="bg-amber-50 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full border border-amber-200">
                    {"★".repeat(Number(t.rating) || 5)}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600 text-base max-w-[260px] truncate italic">&quot;{t.text || "—"}&quot;</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setViewTest(t)} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"><MdVisibility /> View</button>
                    <button onClick={() => { setEditEntry(t); setModal(true); }} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"><MdEdit /> Edit</button>
                    <button onClick={() => handleDelete(t._id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"><MdDelete /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <TestimonialModal entry={editEntry} onSave={handleSave} onClose={() => { setModal(false); setEditEntry(null); }} />}

      {viewTest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><MdVisibility /> Testimonial Details</h2>
              <button onClick={() => setViewTest(null)} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#00aa59]/30 bg-[#00aa59] flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {viewTest.photo ? <img src={viewTest.photo} alt={viewTest.name} className="w-full h-full object-cover" /> : viewTest.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{viewTest.name}</p>
                  {viewTest.role && <p className="text-base text-gray-500 mt-0.5">{viewTest.role}</p>}
                  <span className="inline-flex items-center bg-amber-50 text-amber-700 text-base font-bold px-3 py-1 rounded-full border border-amber-200 mt-2">
                    {"★".repeat(Number(viewTest.rating) || 5)}
                  </span>
                </div>
              </div>
              {viewTest.text && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Review</p>
                  <p className="text-base text-gray-700 italic leading-relaxed">&quot;{viewTest.text}&quot;</p>
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewTest(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
