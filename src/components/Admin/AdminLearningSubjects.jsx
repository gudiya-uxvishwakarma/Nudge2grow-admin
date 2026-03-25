import { useState, useEffect, useCallback } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdInbox, MdMenuBook, MdLock, MdTrendingUp,
  MdClose, MdSave, MdExpandMore, MdExpandLess, MdPlayCircle, MdImage,
  MdArrowBack, MdArrowForward, MdCheck,
} from "react-icons/md";
import { api } from "../../api";

// ── Constants ─────────────────────────────────────────────────────────────────
const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const SUBJECT_NAMES = [
  { name: "Math", icon: "🔢" }, { name: "Science / EVS", icon: "🌿" },
  { name: "English", icon: "📖" }, { name: "Social Studies", icon: "🌍" },
  { name: "Artificial Intelligence", icon: "🧠" },
  { name: "Financial Literacy", icon: "💰" }, { name: "Sex & Safety", icon: "❤️" },
];

const SUBJECT_CONFIG = {
  "Math": { icon: "🔢", color: "#3B82F6", bg: "#EFF6FF" },
  "Science / EVS": { icon: "🌿", color: "#10B981", bg: "#ECFDF5" },
  "English": { icon: "📖", color: "#F59E0B", bg: "#FFFBEB" },
  "Social Studies": { icon: "🌍", color: "#EC4899", bg: "#FDF2F8" },
  "Artificial Intelligence": { icon: "🧠", color: "#8B5CF6", bg: "#F5F3FF" },
  "Financial Literacy": { icon: "💰", color: "#10B981", bg: "#ECFDF5" },
  "Sex & Safety": { icon: "❤️", color: "#EF4444", bg: "#FEF2F2" },
};

const TOPIC_TYPES = ["Activity", "Reading", "Video", "Quiz", "Game"];

const STEPS = [
  { key: "info",   label: "Subject Info", emoji: "📋" },
  { key: "topics", label: "Topics",       emoji: "📚" },
];

const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];

const TABS = [
  { key: "subjects", label: "Subjects", emoji: "📚" },
 
];

const makeEmptyTopic     = () => ({ title: "", type: "Activity", description: "", videoUrl: "" });
const makeEmptyFlashcard = () => ({ id: "", title: "", concept: "", parentOutcome: "", section2Title: "", section2: "" });
const makeEmptyQA        = () => ({ id: "", question: "", answer: "" });
const makeEmptyPrompt    = () => ({ id: "", prompt: "", hint: "" });

// ── Shared UI ─────────────────────────────────────────────────────────────────
const CircularProgress = ({ percentage, color = "#10B981", size = 44 }) => {
  const stroke = 4, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{percentage}%</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ value, color = "#10B981" }) => (
  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div className="h-full rounded-full transition-all" style={{ width: `${value || 0}%`, backgroundColor: color }} />
  </div>
);

// ── Subject Card ──────────────────────────────────────────────────────────────
const SubjectCard = ({ s, onEdit, onDelete }) => {
  const cfg = SUBJECT_CONFIG[s.name] || { icon: "📚", color: "#6B7280", bg: "#F9FAFB" };
  const progress = s.progress || 0;
  const status = progress >= 80 ? "On Track" : progress >= 50 ? "In Progress" : s.status || "Started";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {s.imageUrl
            ? <img src={s.imageUrl} alt={s.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
            : <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: cfg.bg }}>{cfg.icon}</div>}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-gray-800 text-sm">{s.name}</span>
              {s.type === "premium" && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                  <MdLock className="text-xs" /> Premium
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{s.description || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CircularProgress percentage={progress} color={s.type === "premium" ? "#F59E0B" : cfg.color} size={44} />
          <div className="flex flex-col gap-1">
            <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"><MdEdit className="text-base" /></button>
            <button onClick={() => onDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><MdDelete className="text-base" /></button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar value={progress} color={s.type === "premium" ? "#F59E0B" : cfg.color} />
        <span className="text-xs font-semibold text-gray-500 shrink-0">{s.completed || 0}/{s.topics || 0}</span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs text-gray-400"><MdMenuBook className="text-sm" /> {s.topics || 0} topics</span>
        {s.type === "premium"
          ? <span className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-200 px-2.5 py-1 rounded-lg"><MdLock className="text-xs" /> Locked</span>
          : <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${progress >= 80 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{status} ✓</span>}
      </div>
    </div>
  );
};

// ── Add/Edit Subject Modal (multi-step) ───────────────────────────────────────
const makeForm = (editing) => ({
  name:        editing?.name        || "",
  imageUrl:    editing?.imageUrl    || "",
  description: editing?.description || "",
  grade:       editing?.grade       || "",
  title:       editing?.title       || "",
  topics:      Array.isArray(editing?.topicsList) ? editing.topicsList : [],
  flashcards:  editing?.flashcards  || [],
  qaCards:     editing?.qaCards     || [],
  prompts:     editing?.prompts     || [],
  greatJobTitle:   editing?.greatJobTitle   || "Great Job! 🎉",
  greatJobMessage: editing?.greatJobMessage || "You've completed this topic. Keep up the amazing work!",
});

// Step: Subject Info
const StepInfo = ({ form, set }) => {
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => set("imageUrl", ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-5">
      {/* Image */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Subject Image</label>
        <label className="flex items-center gap-4 cursor-pointer group">
          <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden transition ${form.imageUrl ? "border-[#00aa59]" : "border-gray-300 group-hover:border-[#00aa59]"}`}>
            {form.imageUrl ? <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <MdImage className="text-3xl text-gray-300 group-hover:text-[#00aa59] transition" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-[#00aa59] transition">{form.imageUrl ? "Change Image" : "Select Image"}</p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP · max 5MB</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
        {form.imageUrl && <button type="button" onClick={() => set("imageUrl", "")} className="mt-2 text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1"><MdDelete className="text-xs" /> Remove</button>}
      </div>
      {/* Subject Name */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Subject Name *</label>
        <input className={inp} placeholder="e.g. Math, English…" value={form.name} onChange={e => set("name", e.target.value)} />
        <div className="flex flex-wrap gap-2 mt-2">
          {SUBJECT_NAMES.map(s => (
            <button key={s.name} type="button" onClick={() => set("name", s.name)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${form.name === s.name ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title</label>
        <input className={inp} placeholder="e.g. Introduction to Math…" value={form.title} onChange={e => set("title", e.target.value)} />
      </div>
      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Description</label>
        <textarea className={`${inp} resize-none`} rows={3} placeholder="Short description…" value={form.description} onChange={e => set("description", e.target.value)} />
      </div>
      {/* Grade */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Grade</label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map(g => (
            <button key={g} type="button" onClick={() => set("grade", form.grade === g ? "" : g)}
              className={`text-xs px-4 py-2 rounded-full border font-semibold transition ${form.grade === g ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step: Topics
const StepTopics = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.topics, makeEmptyTopic()]; setForm(f => ({ ...f, topics: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const t = [...form.topics]; t[i] = { ...t[i], [k]: v }; setForm(f => ({ ...f, topics: t })); };
  const remove = (i) => { setForm(f => ({ ...f, topics: f.topics.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Topics <span className="text-gray-400 font-normal">({form.topics.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-[#00aa59] text-white px-3 py-1.5 rounded-lg hover:bg-[#008f4a] transition"><MdAdd /> Add Topic</button>
      </div>
      {form.topics.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">No topics yet</div>}
      <div className="space-y-2">
        {form.topics.map((t, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#00aa59] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{t.title || t.type || "Topic"}</span>
                {t.videoUrl && <MdPlayCircle className="text-blue-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-gray-400" /> : <MdExpandMore className="text-gray-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} placeholder="Topic title…" value={t.title} onChange={e => setField(i, "title", e.target.value)} /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Type</label>
                  <div className="flex flex-wrap gap-2">{TOPIC_TYPES.map(tp => <button key={tp} type="button" onClick={() => setField(i, "type", tp)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition ${t.type === tp ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>{tp}</button>)}</div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Describe this topic…" value={t.description} onChange={e => setField(i, "description", e.target.value)} /></div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Video URL (optional)</label>
                  <div className="relative"><MdPlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" /><input className={`${inp} pl-9`} placeholder="https://youtube.com/…" value={t.videoUrl} onChange={e => setField(i, "videoUrl", e.target.value)} /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Flashcards
const StepFlashcards = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.flashcards, makeEmptyFlashcard()]; setForm(f => ({ ...f, flashcards: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...form.flashcards]; c[i] = { ...c[i], [k]: v }; setForm(f => ({ ...f, flashcards: c })); };
  const remove = (i) => { setForm(f => ({ ...f, flashcards: f.flashcards.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Flashcards <span className="text-gray-400 font-normal">({form.flashcards.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition"><MdAdd /> Add Card</button>
      </div>
      {form.flashcards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-indigo-100 rounded-xl text-gray-400 text-xs">No flashcards yet</div>}
      <div className="space-y-2">
        {form.flashcards.map((fc, i) => (
          <div key={i} className="border border-indigo-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{fc.title || "Untitled"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-indigo-400" /> : <MdExpandMore className="text-indigo-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} value={fc.title} onChange={e => setField(i, "title", e.target.value)} placeholder="Card title…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Concept</label><textarea className={`${inp} resize-none`} rows={4} value={fc.concept} onChange={e => setField(i, "concept", e.target.value)} placeholder="Main concept…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Parent Outcome</label><textarea className={`${inp} resize-none`} rows={2} value={fc.parentOutcome} onChange={e => setField(i, "parentOutcome", e.target.value)} placeholder="What parent should do…" /></div>
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <p className="text-xs text-gray-400">Optional second section</p>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Title</label><input className={inp} value={fc.section2Title} onChange={e => setField(i, "section2Title", e.target.value)} placeholder="e.g. Helpful Way to Explain" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Content</label><textarea className={`${inp} resize-none`} rows={2} value={fc.section2} onChange={e => setField(i, "section2", e.target.value)} placeholder="Additional explanation…" /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Q&A
const StepQA = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.qaCards, makeEmptyQA()]; setForm(f => ({ ...f, qaCards: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...form.qaCards]; c[i] = { ...c[i], [k]: v }; setForm(f => ({ ...f, qaCards: c })); };
  const remove = (i) => { setForm(f => ({ ...f, qaCards: f.qaCards.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Q&A Cards <span className="text-gray-400 font-normal">({form.qaCards.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-teal-500 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 transition"><MdAdd /> Add Q&A</button>
      </div>
      {form.qaCards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-teal-100 rounded-xl text-gray-400 text-xs">No Q&A cards yet</div>}
      <div className="space-y-2">
        {form.qaCards.map((qa, i) => (
          <div key={i} className="border border-teal-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{qa.question || "Question…"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-teal-400" /> : <MdExpandMore className="text-teal-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Question</label><textarea className={`${inp} resize-none`} rows={2} value={qa.question} onChange={e => setField(i, "question", e.target.value)} placeholder="Enter question…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Answer</label><textarea className={`${inp} resize-none`} rows={3} value={qa.answer} onChange={e => setField(i, "answer", e.target.value)} placeholder="Enter answer…" /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Prompts
const StepPrompts = ({ form, setForm }) => {
  const [expanded, setExpanded] = useState(null);
  const add = () => { const u = [...form.prompts, makeEmptyPrompt()]; setForm(f => ({ ...f, prompts: u })); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const p = [...form.prompts]; p[i] = { ...p[i], [k]: v }; setForm(f => ({ ...f, prompts: p })); };
  const remove = (i) => { setForm(f => ({ ...f, prompts: f.prompts.filter((_, idx) => idx !== i) })); setExpanded(null); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Prompts <span className="text-gray-400 font-normal">({form.prompts.length})</span></p>
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition"><MdAdd /> Add Prompt</button>
      </div>
      {form.prompts.length === 0 && <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-xl text-gray-400 text-xs">No prompts yet</div>}
      <div className="space-y-2">
        {form.prompts.map((pr, i) => (
          <div key={i} className="border border-amber-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-700 truncate">{pr.prompt || "Prompt…"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>
                {expanded === i ? <MdExpandLess className="text-amber-400" /> : <MdExpandMore className="text-amber-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Prompt / Activity</label><textarea className={`${inp} resize-none`} rows={4} value={pr.prompt} onChange={e => setField(i, "prompt", e.target.value)} placeholder="Enter prompt or activity…" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Hint</label><textarea className={`${inp} resize-none`} rows={2} value={pr.hint} onChange={e => setField(i, "hint", e.target.value)} placeholder="Hint for the parent…" /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step: Great Job
const StepGreatJob = ({ form, set }) => (
  <div className="space-y-5">
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 text-center">
      <div className="text-5xl mb-3">🎉</div>
      <p className="text-lg font-extrabold text-gray-800">{form.greatJobTitle || "Great Job!"}</p>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{form.greatJobMessage || "You've completed this topic!"}</p>
    </div>
    <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title</label><input className={inp} placeholder="Great Job! 🎉" value={form.greatJobTitle} onChange={e => set("greatJobTitle", e.target.value)} /></div>
    <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Message</label><textarea className={`${inp} resize-none`} rows={3} placeholder="You've completed this topic. Keep up the amazing work!" value={form.greatJobMessage} onChange={e => set("greatJobMessage", e.target.value)} /></div>
  </div>
);

// ── Add/Edit Modal ────────────────────────────────────────────────────────────
const AddSubjectModal = ({ editing, saving, onClose, onSave }) => {
  const [form, setForm] = useState(() => makeForm(editing));
  const [step, setStep] = useState(0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isLast = step === STEPS.length - 1;
  const valid = form.name.trim();

  const renderStep = () => {
    switch (STEPS[step].key) {
      case "info":   return <StepInfo form={form} set={set} />;
      case "topics": return <StepTopics form={form} setForm={setForm} />;
      default:       return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "92vh" }}>
        <div className="bg-[#00aa59] px-7 py-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">{editing ? `Edit: ${editing.name}` : "Add Subject"}</h2>
              <p className="text-white/70 text-xs mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition"><MdClose className="text-xl" /></button>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {STEPS.map((s, i) => (
              <button key={s.key} type="button" onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition shrink-0 ${i === step ? "bg-white text-[#00aa59]" : i < step ? "bg-white/30 text-white" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"}`}>
                {i < step ? <MdCheck className="text-sm" /> : <span>{s.emoji}</span>}
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-1 bg-gray-100 shrink-0">
          <div className="h-full bg-[#00aa59] transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6">{renderStep()}</div>
        <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <button onClick={step > 0 ? () => setStep(s => s - 1) : onClose} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
            <MdArrowBack className="text-base" />{step > 0 ? "Back" : "Cancel"}
          </button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => <button key={i} type="button" onClick={() => setStep(i)} className={`rounded-full transition-all ${i === step ? "w-5 h-2 bg-[#00aa59]" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`} />)}
          </div>
          {isLast
            ? <button disabled={!valid || saving} onClick={() => onSave(form)} className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold transition shadow ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}><MdSave /> {saving ? "Saving…" : "Save Subject"}</button>
            : <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow">Next <MdArrowForward className="text-base" /></button>}
        </div>
      </div>
    </div>
  );
};

// ── Tab: Subjects list ────────────────────────────────────────────────────────
const TabSubjects = ({ subjects, onEdit, onDelete, onAdd, refreshing }) => {
  const [filter, setFilter] = useState("all");
  const regular    = subjects.filter(s => s.type !== "premium");
  const premium    = subjects.filter(s => s.type === "premium");
  const inProgress = subjects.filter(s => s.status === "In Progress");
  const filtered   = filter === "progress" ? inProgress : filter === "premium" ? premium : regular;

  const totalActivities = subjects.reduce((a, s) => a + (s.topics || 0), 0);
  const doneActivities  = subjects.reduce((a, s) => a + (s.completed || 0), 0);
  const overallProgress = subjects.length ? Math.round(subjects.reduce((a, s) => a + (s.progress || 0), 0) / subjects.length) : 0;
  const activeCount     = subjects.filter(s => s.enabled).length;

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      {refreshing && <div className="fixed top-4 right-4 z-50 bg-[#00aa59] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">Saving…</div>}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-5">
        <CircularProgress percentage={overallProgress} color="#10B981" size={60} />
        <div className="flex-1">
          <p className="font-bold text-gray-800 text-lg">Overall Progress</p>
          <p className="text-sm text-gray-400 mt-0.5">{doneActivities} of {totalActivities} activities done</p>
          <div className="flex items-center gap-1 mt-1.5"><MdTrendingUp className="text-[#10B981] text-base" /><span className="text-xs font-semibold text-[#10B981]">+12% from last week</span></div>
        </div>
        <div className="text-center shrink-0 pl-5 border-l border-gray-100">
          <p className="text-3xl font-extrabold text-gray-800">{activeCount}</p>
          <p className="text-sm text-gray-400 font-medium">Active</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[{ key: "all", label: "All", count: regular.length }, { key: "progress", label: "In Progress", count: inProgress.length }, { key: "premium", label: "Premium", count: premium.length }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${filter === f.key ? "bg-[#2C3E50] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {f.label}<span className={`text-xs px-2 py-0.5 rounded-full ${filter === f.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>{f.count}</span>
            </button>
          ))}
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#008f4a] transition shadow-md"><MdAdd className="text-lg" /> Add Subject</button>
      </div>
      {filtered.length === 0
        ? <div className="flex flex-col items-center justify-center py-20 text-gray-400"><MdInbox className="text-5xl mb-3" /><p className="text-sm font-medium mb-3">No subjects found</p><button onClick={onAdd} className="flex items-center gap-2 bg-[#00aa59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition"><MdAdd /> Add Subject</button></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(s => <SubjectCard key={s._id} s={s} onEdit={onEdit} onDelete={onDelete} />)}</div>}
    </div>
  );
};

// ── Tab: Topics / Flashcards / QA / Prompts / GreatJob (per-subject edit) ─────
const SubjectGrid = ({ subjects, onSelect, emptyIcon, countFn, btnColor }) => (
  <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
    {subjects.length === 0
      ? <div className="flex flex-col items-center justify-center py-20 text-gray-400"><MdInbox className="text-5xl mb-3" /><p className="text-sm">No subjects yet — add one from the Subjects tab first.</p></div>
      : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-3">
                {s.imageUrl ? <img src={s.imageUrl} alt={s.name} className="w-10 h-10 rounded-xl object-cover" /> : <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">{emptyIcon}</div>}
                <div><p className="font-bold text-gray-800 text-sm">{s.name}</p><p className="text-xs text-gray-400">{countFn(s)}</p></div>
              </div>
              <button onClick={() => onSelect(s)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${btnColor}`}><MdEdit className="text-sm" /> Edit</button>
            </div>
          ))}
        </div>}
  </div>
);

// Per-subject modals for tabs
const TopicsModal = ({ subject, onClose, onSaved }) => {
  const [topics, setTopics] = useState(Array.isArray(subject.topicsList) ? subject.topicsList : []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...topics, makeEmptyTopic()]; setTopics(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const t = [...topics]; t[i] = { ...t[i], [k]: v }; setTopics(t); };
  const remove = (i) => { setTopics(t => t.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { topicsList: topics, topics: topics.length }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-[#00aa59] px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Topics — {subject.name}</h2><p className="text-white/70 text-xs">{topics.length} topics</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {topics.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">No topics yet</div>}
          {topics.map((t, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-[#00aa59] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{t.title || t.type || "Topic"}</span>{t.videoUrl && <MdPlayCircle className="text-blue-400 shrink-0" />}</div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-gray-400" /> : <MdExpandMore className="text-gray-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} placeholder="Topic title…" value={t.title} onChange={e => setField(i, "title", e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Type</label><div className="flex flex-wrap gap-2">{TOPIC_TYPES.map(tp => <button key={tp} type="button" onClick={() => setField(i, "type", tp)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition ${t.type === tp ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>{tp}</button>)}</div></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Describe this topic…" value={t.description} onChange={e => setField(i, "description", e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Video URL (optional)</label><div className="relative"><MdPlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" /><input className={`${inp} pl-9`} placeholder="https://youtube.com/…" value={t.videoUrl} onChange={e => setField(i, "videoUrl", e.target.value)} /></div></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"><MdAdd /> Add Topic</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00aa59] text-white text-sm font-bold hover:bg-[#008f4a] transition"><MdSave /> {saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardsModal = ({ subject, onClose, onSaved }) => {
  const [cards, setCards] = useState(subject.flashcards || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...cards, makeEmptyFlashcard()]; setCards(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...cards]; c[i] = { ...c[i], [k]: v }; setCards(c); };
  const remove = (i) => { setCards(c => c.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { flashcards: cards.map((fc, i) => ({ ...fc, id: fc.id || `fc${i + 1}` })) }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Flashcards — {subject.name}</h2><p className="text-white/70 text-xs">{cards.length} cards</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {cards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-indigo-100 rounded-xl text-gray-400 text-xs">No flashcards yet</div>}
          {cards.map((fc, i) => (
            <div key={i} className="border border-indigo-100 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{fc.title || "Untitled"}</span></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-indigo-400" /> : <MdExpandMore className="text-indigo-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label><input className={inp} value={fc.title} onChange={e => setField(i, "title", e.target.value)} placeholder="Card title…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Concept</label><textarea className={`${inp} resize-none`} rows={4} value={fc.concept} onChange={e => setField(i, "concept", e.target.value)} placeholder="Main concept…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Parent Outcome</label><textarea className={`${inp} resize-none`} rows={2} value={fc.parentOutcome} onChange={e => setField(i, "parentOutcome", e.target.value)} placeholder="What parent should do…" /></div>
                  <div className="pt-2 border-t border-gray-100 space-y-3"><p className="text-xs text-gray-400">Optional second section</p><div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Title</label><input className={inp} value={fc.section2Title} onChange={e => setField(i, "section2Title", e.target.value)} placeholder="e.g. Helpful Way to Explain" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Section 2 Content</label><textarea className={`${inp} resize-none`} rows={2} value={fc.section2} onChange={e => setField(i, "section2", e.target.value)} placeholder="Additional explanation…" /></div></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"><MdAdd /> Add Card</button>
          <div className="flex gap-2"><button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition"><MdSave /> {saving ? "Saving…" : "Save"}</button></div>
        </div>
      </div>
    </div>
  );
};

const QAModal = ({ subject, onClose, onSaved }) => {
  const [cards, setCards] = useState(subject.qaCards || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...cards, makeEmptyQA()]; setCards(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const c = [...cards]; c[i] = { ...c[i], [k]: v }; setCards(c); };
  const remove = (i) => { setCards(c => c.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { qaCards: cards.map((qa, i) => ({ ...qa, id: qa.id || `q${i + 1}` })) }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-teal-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Q&A — {subject.name}</h2><p className="text-white/70 text-xs">{cards.length} cards</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {cards.length === 0 && <div className="text-center py-10 border-2 border-dashed border-teal-100 rounded-xl text-gray-400 text-xs">No Q&A cards yet</div>}
          {cards.map((qa, i) => (
            <div key={i} className="border border-teal-100 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{qa.question || "Question…"}</span></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-teal-400" /> : <MdExpandMore className="text-teal-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Question</label><textarea className={`${inp} resize-none`} rows={2} value={qa.question} onChange={e => setField(i, "question", e.target.value)} placeholder="Enter question…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Answer</label><textarea className={`${inp} resize-none`} rows={3} value={qa.answer} onChange={e => setField(i, "answer", e.target.value)} placeholder="Enter answer…" /></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-teal-50 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-100 transition"><MdAdd /> Add Q&A</button>
          <div className="flex gap-2"><button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition"><MdSave /> {saving ? "Saving…" : "Save"}</button></div>
        </div>
      </div>
    </div>
  );
};

const PromptsModal = ({ subject, onClose, onSaved }) => {
  const [prompts, setPrompts] = useState(subject.prompts || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const add = () => { const u = [...prompts, makeEmptyPrompt()]; setPrompts(u); setExpanded(u.length - 1); };
  const setField = (i, k, v) => { const p = [...prompts]; p[i] = { ...p[i], [k]: v }; setPrompts(p); };
  const remove = (i) => { setPrompts(p => p.filter((_, idx) => idx !== i)); setExpanded(null); };
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { prompts: prompts.map((pr, i) => ({ ...pr, id: pr.id || `p${i + 1}` })) }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="bg-amber-500 px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Prompts — {subject.name}</h2><p className="text-white/70 text-xs">{prompts.length} prompts</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {prompts.length === 0 && <div className="text-center py-10 border-2 border-dashed border-amber-100 rounded-xl text-gray-400 text-xs">No prompts yet</div>}
          {prompts.map((pr, i) => (
            <div key={i} className="border border-amber-100 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition">
                <div className="flex items-center gap-2 min-w-0"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-gray-700 truncate">{pr.prompt || "Prompt…"}</span></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1 rounded-lg hover:bg-red-50 text-red-400"><MdDelete className="text-sm" /></button>{expanded === i ? <MdExpandLess className="text-amber-400" /> : <MdExpandMore className="text-amber-400" />}</div>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 bg-white">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Prompt / Activity</label><textarea className={`${inp} resize-none`} rows={4} value={pr.prompt} onChange={e => setField(i, "prompt", e.target.value)} placeholder="Enter prompt or activity…" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Hint</label><textarea className={`${inp} resize-none`} rows={2} value={pr.hint} onChange={e => setField(i, "hint", e.target.value)} placeholder="Hint for the parent…" /></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <button onClick={add} className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-100 transition"><MdAdd /> Add Prompt</button>
          <div className="flex gap-2"><button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"><MdSave /> {saving ? "Saving…" : "Save"}</button></div>
        </div>
      </div>
    </div>
  );
};

const GreatJobModal = ({ subject, onClose, onSaved }) => {
  const [title, setTitle]     = useState(subject.greatJobTitle   || "Great Job! 🎉");
  const [message, setMessage] = useState(subject.greatJobMessage || "You've completed this topic. Keep up the amazing work!");
  const [saving, setSaving]   = useState(false);
  const save = async () => { setSaving(true); try { await api.subjects.update(subject._id, { greatJobTitle: title, greatJobMessage: message }); onSaved(); } catch (e) { alert("Save failed"); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="bg-[#00aa59] px-6 py-4 flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-extrabold text-white">Great Job Screen — {subject.name}</h2><p className="text-white/70 text-xs">Shown after all cards are completed</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"><MdClose /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-base font-extrabold text-gray-800">{title || "Great Job!"}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message || "You've completed this topic!"}</p>
          </div>
          <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Title</label><input className={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Great Job! 🎉" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Message</label><textarea className={`${inp} resize-none`} rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="You've completed this topic…" /></div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00aa59] text-white text-sm font-bold hover:bg-[#008f4a] transition"><MdSave /> {saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminLearningSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [activeTab, setActiveTab] = useState("subjects");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.subjects.getAll();
      setSubjects(Array.isArray(res) ? res : (res.data || []));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.subjects.getAll();
      setSubjects(Array.isArray(res) ? res : (res.data || []));
    } catch (e) { console.error(e); }
    finally { setRefreshing(false); }
  };

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setShowModal(true); };
  const remove   = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    await api.subjects.remove(id);
    refresh();
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        title:       form.title       || "",
        imageUrl:    form.imageUrl    || "",
        description: form.description || "",
        grade:       form.grade       || "",
        topics:      Array.isArray(form.topics) ? form.topics.length : 0,
        topicsList:  form.topics      || [],
        flashcards:  (form.flashcards || []).map((fc, i) => ({ ...fc, id: fc.id || `fc${i + 1}` })),
        qaCards:     (form.qaCards    || []).map((qa, i) => ({ ...qa, id: qa.id || `q${i + 1}` })),
        prompts:     (form.prompts    || []).map((pr, i) => ({ ...pr, id: pr.id || `p${i + 1}` })),
        greatJobTitle:   form.greatJobTitle   || "Great Job! 🎉",
        greatJobMessage: form.greatJobMessage || "You've completed this topic. Keep up the amazing work!",
        enabled:  true,
        type:     editing?.type     || "regular",
        status:   editing?.status   || "On Track",
        progress: editing?.progress || 0,
        completed: editing?.completed || 0,
        streak:   editing?.streak   || 0,
      };
      if (editing) await api.subjects.update(editing._id, payload);
      else await api.subjects.create(payload);
      setShowModal(false); setEditing(null);
      await refresh();
    } catch (e) { console.error(e); alert("Failed to save."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading...</div>;

  const renderTab = () => {
    switch (activeTab) {
      case "subjects":
        return <TabSubjects subjects={subjects} onEdit={openEdit} onDelete={remove} onAdd={openAdd} refreshing={refreshing} />;
      case "topics":
        return (
          <>
            <SubjectGrid subjects={subjects} onSelect={setSelected} emptyIcon="📚"
              countFn={s => `${Array.isArray(s.topicsList) ? s.topicsList.length : (s.topics || 0)} topics`}
              btnColor="bg-green-50 text-green-600 border-green-200 hover:bg-green-100" />
            {selected && <TopicsModal subject={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); refresh(); }} />}
          </>
        );
      case "flashcards":
        return (
          <>
            <SubjectGrid subjects={subjects} onSelect={setSelected} emptyIcon="🃏"
              countFn={s => `${(s.flashcards || []).length} flashcards`}
              btnColor="bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100" />
            {selected && <FlashcardsModal subject={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); refresh(); }} />}
          </>
        );
      case "qa":
        return (
          <>
            <SubjectGrid subjects={subjects} onSelect={setSelected} emptyIcon="❓"
              countFn={s => `${(s.qaCards || []).length} Q&A cards`}
              btnColor="bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100" />
            {selected && <QAModal subject={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); refresh(); }} />}
          </>
        );
      case "prompts":
        return (
          <>
            <SubjectGrid subjects={subjects} onSelect={setSelected} emptyIcon="💬"
              countFn={s => `${(s.prompts || []).length} prompts`}
              btnColor="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" />
            {selected && <PromptsModal subject={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); refresh(); }} />}
          </>
        );
      case "greatjob":
        return (
          <>
            <SubjectGrid subjects={subjects} onSelect={setSelected} emptyIcon="🎉"
              countFn={s => s.greatJobTitle || "Great Job! 🎉"}
              btnColor="bg-green-50 text-green-600 border-green-200 hover:bg-green-100" />
            {selected && <GreatJobModal subject={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); refresh(); }} />}
          </>
        );
      default: return null;
    }
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelected(null); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${activeTab === tab.key ? "border-[#00aa59] text-[#00aa59] bg-green-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              <span>{tab.emoji}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {renderTab()}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddSubjectModal editing={editing} saving={saving}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave} />
      )}
    </div>
  );
};

export default AdminLearningSubjects;
