import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdQuiz, MdSchool, MdBarChart, MdTrendingUp, MdMenuBook, MdNotes, MdHelp, MdSportsScore, MdVisibility } from "react-icons/md";
import { api } from "../../api";

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

const QUIZ_STATUSES = ["Draft", "Sent", "Archived"];
const QUESTION_FORMATS = ["MCQ", "True / False", "Fill in the Blanks", "Short Answer", "Match the Following"];
const QUIZ_LENGTHS = ["5 Questions", "10 Questions", "15 Questions", "20 Questions", "25 Questions", "30 Questions"];

const EMPTY_SUBJECT = { name: "", color: "#3B82F6", topic: "", questionFormat: "MCQ", quizLength: "10 Questions", status: "Never" };
const EMPTY_QUIZ = { title: "", subject: "", questions: "", types: "", status: "Draft" };

const TABS = [
  { key: "subjects", label: "Subjects", icon: <MdSchool /> },
  { key: "quizzes",  label: "Recent Quizzes", icon: <MdQuiz /> },
  { key: "qtypes",   label: "Quiz Types", icon: <MdBarChart /> },
];

// ── Modal ─────────────────────────────────────────────────────────────────────
const ModalWrap = ({ title, subtitle, onClose, onSave, valid, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white">{title}</h2>
          {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
          <MdClose className="text-xl" />
        </button>
      </div>
      <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
        <button disabled={!valid} onClick={onSave}
          className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
          <MdSave /> Save
        </button>
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminQuiz = () => {
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [sharedSubjects, setSharedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [viewItem, setViewItem] = useState(null);
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  // ── Load all data from backend ──
  const loadAll = async () => {
    setLoading(true);
    try {
      const [subRes, quizRes, sharedRes] = await Promise.all([
        api.quizSubjects.getAll(),
        api.recentQuizzes.getAll(),
        api.subjects.getAll(),
      ]);
      setSubjects(subRes.data  || subRes  || []);
      setQuizzes(quizRes.data  || quizRes || []);
      setSharedSubjects(sharedRes.data || sharedRes || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const getList = (type) => ({ subjects, quizzes }[type]);

  const openAdd  = (type, empty) => { setForm({ ...empty }); setModal({ type, id: null }); };
  const openEdit = (type, id)    => { setForm({ ...getList(type).find((x) => x._id === id) }); setModal({ type, id }); };
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.type === "subjects") {
        if (modal.id) await api.quizSubjects.update(modal.id, form);
        else          await api.quizSubjects.create(form);
      } else {
        if (modal.id) await api.recentQuizzes.update(modal.id, form);
        else          await api.recentQuizzes.create(form);
      }
      closeModal();
      await loadAll();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      if (type === "subjects") await api.quizSubjects.remove(id);
      else                     await api.recentQuizzes.remove(id);
      await loadAll();
    } catch (e) { console.error(e); }
  };

  const isValid = () => {
    if (!modal) return false;
    if (modal.type === "subjects") return !!form.name?.trim();
    if (modal.type === "quizzes")  return !!form.subject?.trim();
    return false;
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>;

  // Derive quiz types from quizzes
  const derivedTypes = (() => {
    const map = new Map();
    quizzes.forEach((q) => {
      if (!q.types) return;
      q.types.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries());
  })();

  const totalQuestions = quizzes.reduce((s, q) => s + (Number(q.questions) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── PAGE HEADER ── */}
      <div className="rounded-2xl mb-5 overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2d1f 100%)" }}>
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00aa59, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #4F8EF7, transparent)", transform: "translate(-30%, 30%)" }} />

        <div className="relative px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "#00aa5920", color: "#4ECDC4", border: "1px solid #4ECDC440" }}>
              <MdSchool className="text-sm" /> Screen-Free Learning
            </span>
            <h1 className="text-3xl font-extrabold text-white leading-tight">Quiz Management</h1>
            <p className="text-gray-400 text-sm mt-1.5 max-w-md">Build subject-wise quizzes for your child — printed sheets, zero screen time needed.</p>
          </div>
          {/* quick stats inside hero */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Subjects", val: subjects.length, color: "#00aa59" },
              { label: "Quizzes",  val: quizzes.length,  color: "#4F8EF7" },
              { label: "Questions",val: totalQuestions,   color: "#F6C72A" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                <span className="text-2xl font-extrabold" style={{ color: s.color }}>{s.val}</span>
                <span className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <SC label="Subjects"        value={subjects.length}     change="+2"  color="#00aa59" icon={<MdMenuBook />} />
        <SC label="Quizzes"         value={quizzes.length}      change="+4"  color="#4F8EF7" icon={<MdNotes />} />
        <SC label="Total Questions" value={totalQuestions}      change="+12" color="#F6C72A" icon={<MdHelp />} />
        <SC label="Quiz Types"      value={derivedTypes.length} change="+1"  color="#8B5CF6" icon={<MdSportsScore />} />
      </div>

      {/* ── Tabs + Add ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition border-2 ${activeTab === tab.key ? "bg-[#00aa59] text-white border-[#00aa59] shadow" : "bg-white text-gray-600 border-gray-200 hover:border-[#00aa59]/50"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {activeTab !== "qtypes" && (
          <button onClick={() => openAdd(activeTab, activeTab === "subjects" ? EMPTY_SUBJECT : EMPTY_QUIZ)}
            className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
            <MdAdd className="text-xl" /> Add {activeTab === "subjects" ? "Subject" : "Quiz"}
          </button>
        )}
      </div>

      {/* ── Subjects Tab ── */}
      {activeTab === "subjects" && (
        <div>
          {subjects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-20 flex flex-col items-center gap-3 text-gray-400">
              <MdInbox className="text-6xl text-gray-300" />
              <p className="font-medium">No subjects yet</p>
              <p className="text-sm">Click &quot;+ Add Subject&quot; to create your first one</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {subjects.map((s) => {
                const color = s.color || "#6B7280";
                return (
                  <div key={s._id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col items-center gap-3 hover:shadow-lg transition group relative">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: color }}>
                      {s.name?.charAt(0) || "?"}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-800 text-sm leading-tight">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.topic || "—"}</p>
                      <p className="text-xs text-gray-400">{s.questionFormat || "—"} · {s.quizLength || "—"}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${s.status === "Done" ? "bg-green-50 text-[#00aa59] border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {s.status || "Never"}
                    </span>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setViewItem({ type: "subject", data: s })}
                        className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                        <MdVisibility /> View
                      </button>
                      <button onClick={() => openEdit("subjects", s._id)}
                        className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                        <MdEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete("subjects", s._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Recent Quizzes Tab ── */}
      {activeTab === "quizzes" && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#00aa59] text-white text-sm">
                  {["#", "Quiz", "Subject", "Questions", "Types", "Status", "Actions"].map((c) => (
                    <th key={c} className={`px-5 py-4 font-bold uppercase tracking-wider ${c === "Actions" ? "text-center" : ""}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quizzes.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <MdInbox className="text-6xl text-gray-300" />
                      <p className="font-medium">No quizzes yet</p>
                      <p className="text-sm">Click &quot;+ Add Quiz&quot; to create your first one</p>
                    </div>
                  </td></tr>
                ) : quizzes.map((q, i) => {
                  const sharedSub = sharedSubjects.find((s) => s.name === q.subject);
                  const color = sharedSub?.color || "#6B7280";
                  return (
                    <tr key={q._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                      <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-white text-lg font-bold" style={{ backgroundColor: color }}>
                          {q.subject?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
                          style={{ backgroundColor: `${color}15`, color, borderColor: `${color}40` }}>
                          <MdMenuBook className="text-xs" /> {q.subject}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{q.questions || "—"}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-[160px] truncate">{q.types || "—"}</td>
                      <td className="px-5 py-4">
                        {q.status === "Sent"
                          ? <span className="bg-green-50 text-[#00aa59] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">Sent</span>
                          : q.status === "Archived"
                          ? <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">Archived</span>
                          : <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">Draft</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => setViewItem({ type: "quiz", data: q })} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdVisibility /> View</button>
                          <button onClick={() => openEdit("quizzes", q._id)} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdEdit /> Edit</button>
                          <button onClick={() => handleDelete("quizzes", q._id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdDelete /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Quiz Types Tab (auto-derived) ── */}
      {activeTab === "qtypes" && (
        <div>
          {derivedTypes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-20 flex flex-col items-center gap-3 text-gray-400">
              <MdInbox className="text-6xl text-gray-300" />
              <p className="font-medium">No quiz types yet</p>
              <p className="text-sm">Add quizzes with &quot;Types&quot; field filled to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {derivedTypes.map(([name, count]) => (
                <div key={name} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center gap-3 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-2xl bg-[#00aa59]/10 flex items-center justify-center">
                    <MdQuiz className="text-2xl text-[#00aa59]" />
                  </div>
                  <p className="font-bold text-gray-800 text-sm text-center">{name}</p>
                  <span className="bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                    {count} quiz{count > 1 ? "zes" : ""}
                  </span>
                  <p className="text-xs text-gray-400 italic">Auto-generated</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Subject Modal ── */}
      {modal?.type === "subjects" && (() => {
        return (
          <ModalWrap title={modal.id ? "Edit Subject" : "Add Subject"} subtitle="Configure quiz settings for this subject" onClose={closeModal} onSave={handleSave} valid={isValid()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              {sharedSubjects.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                  No subjects added yet. Please add subjects first in the Learning Subjects page.
                </div>
              ) : (
                <select className={inp} value={form.name || ""}
                  onChange={(e) => {
                    const sub = sharedSubjects.find((s) => s.name === e.target.value);
                    setForm((p) => ({ ...p, name: e.target.value, color: sub?.color || "#6B7280" }));
                  }}>
                  <option value="">Select subject…</option>
                  {sharedSubjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Topic</label>
              <input className={inp} placeholder="e.g. Numbers" value={form.topic || ""} onChange={f("topic")} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Question Format</label>
              <select className={inp} value={form.questionFormat || "MCQ"}
                onChange={(e) => setForm((p) => ({ ...p, questionFormat: e.target.value }))}>
                {QUESTION_FORMATS.map((q) => <option key={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Quiz Length</label>
              <select className={inp} value={form.quizLength || "10 Questions"}
                onChange={(e) => setForm((p) => ({ ...p, quizLength: e.target.value }))}>
                {QUIZ_LENGTHS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select className={inp} value={form.status || "Never"}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="Done">Done</option>
                <option value="Never">Never</option>
              </select>
            </div>
          </ModalWrap>
        );
      })()}

      {/* ── Quiz Modal ── */}
      {modal?.type === "quizzes" && (() => {
        return (
          <ModalWrap title={modal.id ? "Edit Quiz" : "Add Quiz"} subtitle="Recent quiz entry" onClose={closeModal} onSave={handleSave} valid={isValid()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
              {sharedSubjects.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                  No subjects added yet. Please add subjects first in the Learning Subjects page.
                </div>
              ) : (
                <select className={inp} value={form.subject || ""} onChange={f("subject")}>
                  <option value="">Select subject…</option>
                  {sharedSubjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Number of Questions</label>
              <input className={inp} type="number" min="1" placeholder="25" value={form.questions || ""}
                onChange={(e) => setForm((p) => ({ ...p, questions: e.target.value === "" ? "" : Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Question Types</label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_FORMATS.map((qt) => {
                  const selected = (form.types || "").split(",").map(t => t.trim()).filter(Boolean).includes(qt);
                  return (
                    <button
                      key={qt}
                      type="button"
                      onClick={() => {
                        const current = (form.types || "").split(",").map(t => t.trim()).filter(Boolean);
                        const updated = selected
                          ? current.filter(t => t !== qt)
                          : [...current, qt];
                        setForm(p => ({ ...p, types: updated.join(", ") }));
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition ${
                        selected
                          ? "bg-[#00aa59] text-white border-[#00aa59] shadow"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#00aa59]/50"
                      }`}
                    >
                      {qt}
                    </button>
                  );
                })}
              </div>
              {form.types && (
                <p className="text-xs text-gray-400 mt-2">Selected: {form.types}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select className={inp} value={form.status || "Draft"} onChange={f("status")}>
                {QUIZ_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </ModalWrap>
        );
      })()}
      {viewItem && (() => {
        const d = viewItem.data;
        const isSubject = viewItem.type === "subject";
        const color = d.color || "#6B7280";
        const sharedSub = isSubject ? null : sharedSubjects.find((s) => s.name === d.subject);
        const subColor = sharedSub?.color || "#6B7280";
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><MdVisibility /> {isSubject ? "Subject Details" : "Quiz Details"}</h2>
                  <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
                </div>
                <button onClick={() => setViewItem(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
              </div>
              <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Hero */}
                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ backgroundColor: isSubject ? color : subColor }}>
                    {isSubject ? (d.name?.charAt(0) || "?") : (d.subject?.charAt(0)?.toUpperCase() || "?")}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-base">{isSubject ? d.name : d.title}</p>
                    {!isSubject && d.subject && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border mt-1"
                        style={{ backgroundColor: `${subColor}15`, color: subColor, borderColor: `${subColor}40` }}>
                        <MdMenuBook className="text-xs" /> {d.subject}
                      </span>
                    )}
                    {isSubject && d.topic && <p className="text-xs text-gray-500 mt-1">{d.topic}</p>}
                  </div>
                </div>
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  {isSubject && [
                    { label: "Format", val: d.questionFormat, color: "#4F8EF7" },
                    { label: "Length", val: d.quizLength, color: "#8B5CF6" },
                  ].filter(i => i.val).map(({ label, val, color: c }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: c }}>{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{val}</p>
                    </div>
                  ))}
                  {!isSubject && d.questions && (
                    <div className="bg-[#00aa59]/5 rounded-xl p-3 border border-green-100 text-center">
                      <p className="text-xs font-bold text-[#00aa59] uppercase tracking-wide mb-1">Questions</p>
                      <p className="text-2xl font-extrabold text-gray-800">{d.questions}</p>
                    </div>
                  )}
                </div>
                {/* Types badges */}
                {!isSubject && d.types && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Question Types</p>
                    <div className="flex flex-wrap gap-2">
                      {d.types.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <span key={t} className="bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full border border-green-200">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Status badge */}
                <div className="flex gap-2">
                  {(isSubject ? d.status === "Done" : d.status === "Sent")
                    ? <span className="bg-green-50 text-[#00aa59] text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">{d.status}</span>
                    : d.status === "Archived"
                    ? <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">Archived</span>
                    : <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200">{d.status || "Never"}</span>}
                </div>
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

export default AdminQuiz;