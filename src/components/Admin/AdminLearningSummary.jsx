import { useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdTrendingUp, MdCheckCircle, MdNotes, MdMenuBook, MdSmartToy, MdEmojiEvents, MdVisibility } from "react-icons/md";

// ── Shared helper: read subjects from LearningSubjects page ──────────────────
const getSharedSubjects = () => {
  try { return JSON.parse(localStorage.getItem("ls_sub_subjects")) || []; }
  catch { return []; }
};

const inp =
  "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const SC = ({ label, value, change, color, icon }) => (
  <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${color}18` }}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-gray-800 leading-none">{value}</p>
      </div>
    </div>
    <span className="flex items-center gap-0.5 text-xs font-bold px-3 py-1.5 rounded-full"
      style={{ backgroundColor: `${color}18`, color }}>
      <MdTrendingUp className="text-sm" />{change}
    </span>
  </div>
);

const PRIORITIES = ["High", "Medium", "Low", ""];

const EMPTY_KNOWN     = { name: "", subject: "Math", progress: "", daysAgo: "" };
const EMPTY_PRACTICE  = { name: "", subject: "Math", progress: "", attempts: "", priority: "High" };
const EMPTY_SUBJECT   = { name: "", icon: "book", progress: "", completed: "", total: "", growth: "", color: "#6366F1" };
const EMPTY_INSIGHT   = { title: "", badge: "", subtitle: "", action: "" };
const EMPTY_MILESTONE = { title: "", date: "", icon: "🏆" };

const TABS = [
  { key: "known",     label: "Known Topics" },
  { key: "practice",  label: "Needs Practice" },
  { key: "subject",   label: "Subjects" },
  { key: "insight",   label: "AI Insights" },
  { key: "milestone", label: "Milestones" },
];

// ── Generic Modal ─────────────────────────────────────────────────────────────
const ModalWrap = ({ title, onClose, onSave, valid, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-white">{title}</h2>
        <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
          <MdClose className="text-xl" />
        </button>
      </div>
      <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
          Cancel
        </button>
        <button disabled={!valid} onClick={onSave}
          className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
          <MdSave /> Save
        </button>
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminLearningSummary = () => {
  const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };
  const persist = (key, setter, data) => { setter(data); localStorage.setItem(key, JSON.stringify(data)); };

  const [activeTab, setActiveTab] = useState("known");
  const [knownTopics,    setKnownTopics]    = useState(() => load("ls_known", []));
  const [practiceTopics, setPracticeTopics] = useState(() => load("ls_practice", []));
  const [subjects,       setSubjects]       = useState(() => load("ls_subjects", []));
  const [insights,       setInsights]       = useState(() => load("ls_insights", []));
  const [milestones,     setMilestones]     = useState(() => load("ls_milestones", []));

  const [modal, setModal] = useState(null); // { type, id }
  const [form,  setForm]  = useState({});
  const [viewItem, setViewItem] = useState(null);
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  // helpers
  const getList = (type) => ({ known: knownTopics, practice: practiceTopics, subject: subjects, insight: insights, milestone: milestones }[type]);
  const setList = (type, data) => {
    const map = { known: [setKnownTopics, "ls_known"], practice: [setPracticeTopics, "ls_practice"], subject: [setSubjects, "ls_subjects"], insight: [setInsights, "ls_insights"], milestone: [setMilestones, "ls_milestones"] };
    persist(map[type][1], map[type][0], data);
  };

  const openAdd  = (type, empty) => { setForm({ ...empty }); setModal({ type, id: null }); };
  const openEdit = (type, id)    => { setForm({ ...getList(type).find((x) => x._id === id) }); setModal({ type, id }); };
  const closeModal = () => setModal(null);

  const handleSave = () => {
    const entry = { ...form, _id: modal.id ?? Date.now() };
    const list  = getList(modal.type);
    setList(modal.type, modal.id !== null ? list.map((x) => x._id === modal.id ? entry : x) : [...list, entry]);
    closeModal();
  };

  const handleDelete = (type, id) => {
    if (!window.confirm("Delete this entry?")) return;
    setList(type, getList(type).filter((x) => x._id !== id));
  };

  const isValid = () => {
    if (!modal) return false;
    if (modal.type === "known")     return !!form.name?.trim();
    if (modal.type === "practice")  return !!form.name?.trim();
    if (modal.type === "subject")   return !!form.name?.trim();
    if (modal.type === "insight")   return !!form.title?.trim();
    if (modal.type === "milestone") return !!form.title?.trim();
    return false;
  };

  // ── Table configs ──
  const tableConfig = {
    known: {
      empty: EMPTY_KNOWN,
      cols: ["Topic Name", "Subject", "Progress", "Days Ago"],
      rows: knownTopics.map((t) => ({ _id: t._id, cells: [t.name, t.subject, t.progress ? `${t.progress}%` : "—", t.daysAgo ? `${t.daysAgo}d ago` : "—"] })),
    },
    practice: {
      empty: EMPTY_PRACTICE,
      cols: ["Topic Name", "Subject", "Progress", "Attempts", "Priority"],
      rows: practiceTopics.map((t) => ({
        _id: t._id,
        cells: [t.name, t.subject, t.progress ? `${t.progress}%` : "—", t.attempts || "—",
          t.priority ? <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.priority === "High" ? "bg-red-50 text-red-600 border border-red-200" : t.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>{t.priority}</span> : "—"],
      })),
    },
    subject: {
      empty: EMPTY_SUBJECT,
      cols: ["Name", "Icon", "Progress", "Completed/Total", "Growth", "Color"],
      rows: subjects.map((s) => ({
        _id: s._id,
        cells: [s.name, s.icon || "—", s.progress ? `${s.progress}%` : "—", `${s.completed || 0}/${s.total || 0}`, s.growth || "—",
          <span key="c" className="inline-block w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: s.color || "#ccc" }} />],
      })),
    },
    insight: {
      empty: EMPTY_INSIGHT,
      cols: ["Title", "Badge", "Subtitle", "Action"],
      rows: insights.map((ins) => ({ _id: ins._id, cells: [ins.title, ins.badge || "—", ins.subtitle || "—", ins.action || "—"] })),
    },
    milestone: {
      empty: EMPTY_MILESTONE,
      cols: ["Icon", "Title", "Date"],
      rows: milestones.map((m) => ({ _id: m._id, cells: [m.icon || "🏆", m.title, m.date || "—"] })),
    },
  };

  const cfg = tableConfig[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Learning Summary Management</h1>
        <p className="text-gray-500 mt-0.5 text-sm">Manage learning progress data shown in the app</p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <SC label="Known Topics"    value={knownTopics.length}    change="+4"  color="#00aa59" icon={<MdCheckCircle />} />
        <SC label="Need Practice"   value={practiceTopics.length} change="+2"  color="#F59E0B" icon={<MdNotes />} />
        <SC label="Subjects"        value={subjects.length}       change="+1"  color="#4F8EF7" icon={<MdMenuBook />} />
        <SC label="AI Insights"     value={insights.length}       change="+3"  color="#8B5CF6" icon={<MdSmartToy />} />
        <SC label="Milestones"      value={milestones.length}     change="+1"  color="#EC4899" icon={<MdEmojiEvents />} />
      </div>

      {/* Tabs + Add Button */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition border-2 ${activeTab === tab.key ? "bg-[#00aa59] text-white border-[#00aa59] shadow" : "bg-white text-gray-600 border-gray-200 hover:border-[#00aa59]/50"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={() => openAdd(activeTab, cfg.empty)}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-xl" /> Add {TABS.find((t) => t.key === activeTab)?.label}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#00aa59] text-white text-sm">
                <th className="px-5 py-4 font-bold uppercase tracking-wider">#</th>
                {cfg.cols.map((c) => (
                  <th key={c} className="px-5 py-4 font-bold uppercase tracking-wider">{c}</th>
                ))}
                <th className="px-5 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cfg.rows.length === 0 ? (
                <tr>
                  <td colSpan={cfg.cols.length + 2} className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <MdInbox className="text-6xl text-gray-300" />
                      <p className="font-medium">No entries yet</p>
                      <p className="text-sm">Click &quot;+ Add&quot; to create your first one</p>
                    </div>
                  </td>
                </tr>
              ) : (
                cfg.rows.map((row, i) => (
                  <tr key={row._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                    <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="px-5 py-4 text-sm text-gray-700">{cell}</td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setViewItem({ type: activeTab, data: getList(activeTab).find((x) => x._id === row._id) })}
                          className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                          <MdVisibility /> View
                        </button>
                        <button onClick={() => openEdit(activeTab, row._id)}
                          className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                          <MdEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(activeTab, row._id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                          <MdDelete /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "known" && (() => {
        const sharedSubs = getSharedSubjects();
        return (
          <ModalWrap title={modal.id ? "Edit Known Topic" : "Add Known Topic"} onClose={closeModal} onSave={handleSave} valid={isValid()}>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Topic Name <span className="text-red-500">*</span></label>
              <input className={inp} placeholder="e.g. Water Conservation" value={form.name || ""} onChange={f("name")} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
              {sharedSubs.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                  No subjects added yet. Please add subjects first in the Learning Subjects page.
                </div>
              ) : (
                <select className={inp} value={form.subject || ""} onChange={f("subject")}>
                  <option value="">Select subject…</option>
                  {sharedSubs.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Progress (%)</label>
              <input className={inp} type="number" min="0" max="100" placeholder="95" value={form.progress || ""} onChange={f("progress")} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Days Ago</label>
              <input className={inp} type="number" min="0" placeholder="2" value={form.daysAgo || ""} onChange={f("daysAgo")} /></div>
          </ModalWrap>
        );
      })()}

      {modal?.type === "practice" && (() => {
        const sharedSubs = getSharedSubjects();
        return (
          <ModalWrap title={modal.id ? "Edit Practice Topic" : "Add Practice Topic"} onClose={closeModal} onSave={handleSave} valid={isValid()}>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Topic Name <span className="text-red-500">*</span></label>
              <input className={inp} placeholder="e.g. Measurement" value={form.name || ""} onChange={f("name")} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
              {sharedSubs.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                  No subjects added yet. Please add subjects first in the Learning Subjects page.
                </div>
              ) : (
                <select className={inp} value={form.subject || ""} onChange={f("subject")}>
                  <option value="">Select subject…</option>
                  {sharedSubs.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Progress (%)</label>
              <input className={inp} type="number" min="0" max="100" placeholder="45" value={form.progress || ""} onChange={f("progress")} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Attempts</label>
              <input className={inp} type="number" min="0" placeholder="3" value={form.attempts || ""} onChange={f("attempts")} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
              <select className={inp} value={form.priority ?? "High"} onChange={f("priority")}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p || "None"}</option>)}
              </select></div>
          </ModalWrap>
        );
      })()}

      {modal?.type === "subject" && (() => {
        const sharedSubs = getSharedSubjects();
        return (
          <ModalWrap title={modal.id ? "Edit Subject" : "Add Subject"} onClose={closeModal} onSave={handleSave} valid={isValid()}>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Subject Name <span className="text-red-500">*</span></label>
              {sharedSubs.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                  No subjects added yet. Please add subjects first in the Learning Subjects page.
                </div>
              ) : (
                <select className={inp} value={form.name || ""} onChange={f("name")}>
                  <option value="">Select subject…</option>
                  {sharedSubs.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Icon Name</label>
              <input className={inp} placeholder="e.g. calculator, book, leaf, earth, cash" value={form.icon || ""} onChange={f("icon")} />
              <p className="text-xs text-gray-400 mt-1">Ionicons name used in the mobile app (e.g. calculator, book, leaf, earth, cash, hardware-chip)</p>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Progress (%)</label>
              <input className={inp} type="number" min="0" max="100" placeholder="80" value={form.progress || ""} onChange={f("progress")} /></div>
            <div className="flex gap-3">
              <div className="flex-1"><label className="block text-sm font-bold text-gray-700 mb-1">Completed</label>
                <input className={inp} type="number" min="0" placeholder="8" value={form.completed || ""} onChange={f("completed")} /></div>
              <div className="flex-1"><label className="block text-sm font-bold text-gray-700 mb-1">Total</label>
                <input className={inp} type="number" min="0" placeholder="10" value={form.total || ""} onChange={f("total")} /></div>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Growth</label>
              <input className={inp} placeholder="+15%" value={form.growth || ""} onChange={f("growth")} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Color</label>
              <input type="color" className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer" value={form.color || "#6366F1"}
                onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} /></div>
          </ModalWrap>
        );
      })()}

      {modal?.type === "insight" && (
        <ModalWrap title={modal.id ? "Edit Insight" : "Add Insight"} onClose={closeModal} onSave={handleSave} valid={isValid()}>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Consistency Improved" value={form.title || ""} onChange={f("title")} /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Badge</label>
            <input className={inp} placeholder="e.g. Growth" value={form.badge || ""} onChange={f("badge")} /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
            <input className={inp} placeholder="e.g. Activity count grew 33% vs last month" value={form.subtitle || ""} onChange={f("subtitle")} /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Action</label>
            <input className={inp} placeholder="e.g. Maintain the daily habit" value={form.action || ""} onChange={f("action")} /></div>
        </ModalWrap>
      )}

      {modal?.type === "milestone" && (
        <ModalWrap title={modal.id ? "Edit Milestone" : "Add Milestone"} onClose={closeModal} onSave={handleSave} valid={isValid()}>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Icon (emoji)</label>
            <input className={inp} placeholder="🏆" value={form.icon || ""} onChange={f("icon")} /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Top 10% Learner" value={form.title || ""} onChange={f("title")} /></div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
            <div className="relative">
              <input
                className={`${inp} pr-12`}
                type="date"
                value={form.date || ""}
                onChange={f("date")}
                style={{ colorScheme: "light" }}
              />
             
            </div>
          </div>
        </ModalWrap>
      )}

      {viewItem && (() => {
        const d = viewItem.data;
        const type = viewItem.type;
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><MdVisibility /> {TABS.find(t => t.key === type)?.label || "Details"}</h2>
                  <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
                </div>
                <button onClick={() => setViewItem(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
              </div>
              <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Hero */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: d.color ? `${d.color}20` : "#00aa5915", color: d.color || "#00aa59" }}>
                    {type === "milestone" ? (d.icon || "🏆") : type === "insight" ? <MdSmartToy /> : <MdMenuBook />}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-base">{d.title || d.name || "—"}</p>
                    {d.subject && <p className="text-xs text-gray-500 mt-0.5">Subject: {d.subject}</p>}
                    {d.badge && <span className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-200 mt-1">{d.badge}</span>}
                  </div>
                </div>
                {/* Progress bar */}
                {d.progress && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Progress</p>
                      <span className="text-sm font-extrabold text-[#00aa59]">{d.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#00aa59]" style={{ width: `${Math.min(d.progress, 100)}%` }} />
                    </div>
                  </div>
                )}
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {type === "known" && d.daysAgo && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Days Ago</p>
                      <p className="text-lg font-extrabold text-gray-800">{d.daysAgo}d</p>
                    </div>
                  )}
                  {type === "practice" && d.attempts && (
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Attempts</p>
                      <p className="text-lg font-extrabold text-gray-800">{d.attempts}</p>
                    </div>
                  )}
                  {type === "practice" && d.priority && (
                    <div className={`rounded-xl p-3 border text-center ${d.priority === "High" ? "bg-red-50 border-red-100" : d.priority === "Medium" ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100"}`}>
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${d.priority === "High" ? "text-red-600" : d.priority === "Medium" ? "text-amber-600" : "text-gray-500"}`}>Priority</p>
                      <p className="text-lg font-extrabold text-gray-800">{d.priority}</p>
                    </div>
                  )}
                  {type === "subject" && d.completed !== undefined && (
                    <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
                      <p className="text-xs font-bold text-[#00aa59] uppercase tracking-wide mb-1">Completed</p>
                      <p className="text-lg font-extrabold text-gray-800">{d.completed}/{d.total || "?"}</p>
                    </div>
                  )}
                  {type === "subject" && d.growth && (
                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Growth</p>
                      <p className="text-lg font-extrabold text-gray-800">{d.growth}</p>
                    </div>
                  )}
                  {type === "milestone" && d.date && (
                    <div className="bg-pink-50 rounded-xl p-3 border border-pink-100 text-center col-span-2">
                      <p className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-1">Date</p>
                      <p className="text-base font-extrabold text-gray-800">{d.date}</p>
                    </div>
                  )}
                </div>
                {/* Insight details */}
                {type === "insight" && (
                  <div className="space-y-2">
                    {d.subtitle && <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Subtitle</p><p className="text-sm text-gray-700">{d.subtitle}</p></div>}
                    {d.action && <div className="bg-[#00aa59]/5 rounded-xl p-3 border border-green-100"><p className="text-xs font-bold text-[#00aa59] uppercase tracking-wide mb-1">Action</p><p className="text-sm text-gray-700">{d.action}</p></div>}
                  </div>
                )}
                {/* Subject icon */}
                {type === "subject" && d.icon && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Icon</p>
                    <span className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200">{d.icon}</span>
                  </div>
                )}
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => setViewItem(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminLearningSummary;
