import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdUpload, MdTrendingUp, MdPerson, MdImage, MdSchool, MdMenuBook, MdVisibility } from "react-icons/md";
import { api } from "../../api";

const SC = ({ label, value, change, color, icon }) => (
  <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${color}18` }}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-gray-800 leading-none">{value}</p>
      </div>
    </div>
    <span className="flex items-center gap-0.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
      <MdTrendingUp className="text-sm" />{change}
    </span>
  </div>
);

const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];
const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"];
const CORE_AREAS  = [{ id: "mathematics", label: "Mathematics" }, { id: "science", label: "Science" }, { id: "english", label: "English" }, { id: "social-studies", label: "Social Studies" }];
const LIFE_SKILLS = [{ id: "ai", label: "Artificial Intelligence" }, { id: "financial", label: "Financial Literacy" }, { id: "britannica", label: "Britannica / Did You Know" }, { id: "safety", label: "Sex & Safety Education" }];
const AVATARS = [{ id: "A1", color: "#FFB347" }, { id: "A2", color: "#87CEEB" }, { id: "A3", color: "#98FB98" }, { id: "A4", color: "#DDA0DD" }, { id: "A5", color: "#F08080" }, { id: "A6", color: "#20B2AA" }];

const EMPTY = { title: "", description: "", name: "", dateOfBirth: "", grade: "", educationBoard: "", avatar: "", uploadedPhoto: "", coreArea: "", lifeSkill: "" };

const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const valid = form.title.trim() !== "";

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 80; canvas.height = 80;
        canvas.getContext("2d").drawImage(img, 0, 0, 80, 80);
        setForm((p) => ({ ...p, uploadedPhoto: canvas.toDataURL("image/jpeg", 0.6), avatar: "" }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">{entry ? <><MdEdit /> Edit Entry</> : <><MdAdd /> Add New Entry</>}</h2>
            <p className="text-white/80 text-sm mt-0.5">Personal Setup Screen</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"></button>
        </div>
        <div className="px-8 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Add Child Details" value={form.title} onChange={f("title")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea rows={3} className={`${inp} resize-none`} placeholder="Tell us about your child…" value={form.description} onChange={f("description")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input className={inp} placeholder="Child's name" value={form.name} onChange={f("name")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
            <input type="date" className={inp} value={form.dateOfBirth} onChange={f("dateOfBirth")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Grade</label>
            <select className={inp} value={form.grade} onChange={f("grade")}>
              <option value="">Select grade…</option>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Education Board</label>
            <select className={inp} value={form.educationBoard} onChange={f("educationBoard")}>
              <option value="">Select board…</option>
              {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Select Avatar</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {AVATARS.map((av) => (
                <button key={av.id} type="button" onClick={() => setForm((p) => ({ ...p, avatar: av.id, uploadedPhoto: "" }))}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all border-4 ${form.avatar === av.id && !form.uploadedPhoto ? "border-[#00aa59] scale-110 shadow-lg" : "border-transparent hover:border-[#00aa59]/40"}`}
                  style={{ backgroundColor: av.color }}>{av.id}</button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer w-fit border-2 border-dashed border-gray-300 hover:border-[#00aa59] rounded-xl px-4 py-2.5 transition">
              <MdUpload className="text-[#00aa59] text-lg" />
              <span className="text-sm font-semibold text-gray-600">Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            {form.uploadedPhoto && (
              <div className="mt-3 flex items-center gap-3">
                <img src={form.uploadedPhoto} alt="uploaded" className="w-12 h-12 rounded-full object-cover border-4 border-[#00aa59]" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, uploadedPhoto: "" }))} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Core Area</label>
            <select className={inp} value={form.coreArea} onChange={f("coreArea")}>
              <option value="">Select core area…</option>
              {CORE_AREAS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Life Skill</label>
            <select className={inp} value={form.lifeSkill} onChange={f("lifeSkill")}>
              <option value="">Select life skill…</option>
              {LIFE_SKILLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : entry ? "Update" : "Add Entry"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPersonalSetupScreen = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [viewEntry, setViewEntry] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.personalSetup.getAll();
      setEntries(res.data || res || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditEntry(null); setModalOpen(true); };
  const openEdit = (e) => { setEditEntry(e); setModalOpen(true); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editEntry) await api.personalSetup.update(editEntry._id, form);
      else await api.personalSetup.create(form);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try { await api.personalSetup.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  const getCoreLabel  = (id) => CORE_AREAS.find((c) => c.id === id)?.label || "—";
  const getSkillLabel = (id) => LIFE_SKILLS.find((s) => s.id === id)?.label || "—";

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Personal Setup Management</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Manage personal setup screen entries</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-xl" /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <SC label="Total Profiles" value={entries.length}                                      change="+2" color="#00aa59" icon={<MdPerson />} />
        <SC label="With Avatar"    value={entries.filter(e => e.avatar || e.uploadedPhoto).length} change="+1" color="#4F8EF7" icon={<MdImage />} />
        <SC label="Grades Set"     value={entries.filter(e => e.grade).length}                 change="+3" color="#F6C72A" icon={<MdSchool />} />
        <SC label="Core Areas"     value={entries.filter(e => e.coreArea).length}              change="+2" color="#8B5CF6" icon={<MdMenuBook />} />
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#00aa59] text-white text-sm">
                {["No.", "Title", "Description", "Name", "DOB", "Grade", "Board", "Avatar", "Core Area", "Life Skill", "Actions"].map((c) => (
                  <th key={c} className={`px-5 py-4 font-bold uppercase tracking-wider ${c === "Actions" ? "text-center" : ""}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-20 text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <MdInbox className="text-6xl text-gray-300" />
                    <p className="font-medium">No entries yet</p>
                    <p className="text-sm">Click &quot;+ Add Entry&quot; to create your first one</p>
                  </div>
                </td></tr>
              ) : entries.map((entry, i) => {
                const av = AVATARS.find((a) => a.id === entry.avatar);
                return (
                  <tr key={entry._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                    <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800 text-sm max-w-[120px] truncate">{entry.title || "—"}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm max-w-[150px] truncate">{entry.description || "—"}</td>
                    <td className="px-5 py-4 text-gray-700 text-sm whitespace-nowrap">{entry.name || "—"}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{entry.dateOfBirth || "—"}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {entry.grade ? <span className="bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full">{entry.grade}</span> : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {entry.educationBoard ? <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">{entry.educationBoard}</span> : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {entry.uploadedPhoto ? <img src={entry.uploadedPhoto} alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-[#00aa59]" />
                        : av ? <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: av.color }}>{av.id}</div>
                        : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {entry.coreArea ? <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">{getCoreLabel(entry.coreArea)}</span> : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {entry.lifeSkill ? <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-200">{getSkillLabel(entry.lifeSkill)}</span> : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setViewEntry(entry)} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdVisibility /> View</button>
                        <button onClick={() => openEdit(entry)} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdEdit /> Edit</button>
                        <button onClick={() => handleDelete(entry._id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdDelete /> Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <Modal entry={editEntry} onSave={handleSave} onClose={() => { setModalOpen(false); setEditEntry(null); }} saving={saving} />}

      {viewEntry && (() => {
        const av = AVATARS.find((a) => a.id === viewEntry.avatar);
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><MdVisibility /> Profile Details</h2>
                  <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
                </div>
                <button onClick={() => setViewEntry(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
              </div>
              <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  {viewEntry.uploadedPhoto ? <img src={viewEntry.uploadedPhoto} alt="avatar" className="w-16 h-16 rounded-full object-cover border-4 border-[#00aa59] shrink-0" />
                    : av ? <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold border-4 border-white shadow shrink-0" style={{ backgroundColor: av.color }}>{av.id}</div>
                    : <div className="w-16 h-16 rounded-full bg-[#00aa59]/10 flex items-center justify-center shrink-0"><MdPerson className="text-3xl text-[#00aa59]" /></div>}
                  <div>
                    <p className="font-extrabold text-gray-800 text-base">{viewEntry.name || "—"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{viewEntry.title || ""}</p>
                    {viewEntry.description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{viewEntry.description}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: "Date of Birth", val: viewEntry.dateOfBirth, color: "#4F8EF7" }, { label: "Grade", val: viewEntry.grade, color: "#00aa59" }, { label: "Education Board", val: viewEntry.educationBoard, color: "#8B5CF6" }]
                    .filter(i => i.val).map(({ label, val, color }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
                        <p className="text-sm font-semibold text-gray-800">{val}</p>
                      </div>
                    ))}
                </div>
                {(viewEntry.coreArea || viewEntry.lifeSkill) && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Topic Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {viewEntry.coreArea && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200"><MdMenuBook className="text-sm" />{getCoreLabel(viewEntry.coreArea)}</span>}
                      {viewEntry.lifeSkill && <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200"><MdSchool className="text-sm" />{getSkillLabel(viewEntry.lifeSkill)}</span>}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => setViewEntry(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminPersonalSetupScreen;
