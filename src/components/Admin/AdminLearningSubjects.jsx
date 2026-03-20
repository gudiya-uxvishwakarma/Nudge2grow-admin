import { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox,
  MdMenuBook, MdCheckCircle, MdLocalFireDepartment, MdSchool,
  MdLock, MdTrendingUp,
} from "react-icons/md";
import { api } from "../../api";

// ── API ───────────────────────────────────────────────────────────────────────
const subjectApi = {
  getAll: ()       => api.subjects.getAll(),
  create: (body)   => api.subjects.create(body),
  update: (id, b)  => api.subjects.update(id, b),
  remove: (id)     => api.subjects.remove(id),
};

const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";
const STATUS_LIST = ["On Track", "In Progress", "Needs Attention", "Completed"];

const SUBJECT_CONFIG = {
  "Math":                    { icon: "🔢", color: "#3B82F6", bg: "#EFF6FF" },
  "Science / EVS":           { icon: "🌿", color: "#10B981", bg: "#ECFDF5" },
  "English":                 { icon: "📖", color: "#F59E0B", bg: "#FFFBEB" },
  "Social Studies":          { icon: "🌍", color: "#EC4899", bg: "#FDF2F8" },
  "Artificial Intelligence": { icon: "🧠", color: "#8B5CF6", bg: "#F5F3FF" },
  "Financial Literacy":      { icon: "💰", color: "#10B981", bg: "#ECFDF5" },
  "Sex & Safety":            { icon: "❤️", color: "#EF4444", bg: "#FEF2F2" },
};

// Default form values — status & type set by filter context in openAdd
const makeEmpty = (filter) => ({
  name: "", description: "", color: "#3B82F6",
  topics: "", completed: "", progress: "", streak: "",
  isMostActive: false,
  status: filter === "progress" ? "In Progress" : "On Track",
  enabled: true,
  type: filter === "premium" ? "premium" : "regular",
});

// ── Sub-components ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${color}18` }}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-gray-800 leading-none">{value}</p>
    </div>
  </div>
);

const ProgressBar = ({ value, color = "#00aa59" }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${value || 0}%`, backgroundColor: color }} />
    </div>
    <span className="text-xs font-semibold text-gray-500 w-8 text-right">{value || 0}%</span>
  </div>
);

const StatusBadge = ({ s }) => {
  const map = {
    "On Track":        "bg-green-50 text-[#00aa59] border-green-200",
    "In Progress":     "bg-blue-50 text-blue-600 border-blue-200",
    "Needs Attention": "bg-red-50 text-red-600 border-red-200",
    "Completed":       "bg-purple-50 text-purple-600 border-purple-200",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[s] || "bg-gray-100 text-gray-500 border-gray-200"}`}>{s} ✓</span>;
};

const ModalWrap = ({ title, subtitle, onClose, onSave, valid, saving, children }) => (
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
        <button disabled={!valid || saving} onClick={onSave}
          className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
          <MdSave /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  </div>
);

const SubjectCard = ({ s, onEdit, onDelete }) => {
  const cfg = SUBJECT_CONFIG[s.name] || { icon: "📚", color: "#6B7280", bg: "#F9FAFB" };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: cfg.bg }}>{cfg.icon}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-800 text-sm">{s.name}</span>
              {s.isMostActive && <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">Most Active</span>}
              {s.type === "premium" && (
                <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                  <MdLock className="text-xs" /> Premium
                </span>
              )}
              {!s.enabled && <span className="text-[10px] font-semibold bg-gray-100 text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Disabled</span>}
            </div>
            <p className="text-xs text-gray-400 truncate">{s.description || "—"}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"><MdEdit /></button>
          <button onClick={() => onDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><MdDelete /></button>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Progress</span>
          <span>{s.completed || 0} / {s.topics || 0} activities</span>
        </div>
        <ProgressBar value={s.progress} color={s.type === "premium" ? "#F59E0B" : (cfg.color || "#00aa59")} />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><MdMenuBook className="text-sm" /> {s.topics || 0} topics</span>
          {s.streak > 0 && <span className="flex items-center gap-1 text-amber-500 font-semibold">🔥 {s.streak}-day streak</span>}
          {s.type === "premium" && <span className="flex items-center gap-1 text-amber-500 font-semibold"><MdLock className="text-xs" /> Locked</span>}
        </div>
        <StatusBadge s={s.status} />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminLearningSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(makeEmpty("all"));
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await subjectApi.getAll();
      const data = Array.isArray(res) ? res : (res.data || []);
      setSubjects(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await subjectApi.getAll();
      const data = Array.isArray(res) ? res : (res.data || []);
      setSubjects(data);
    } catch (e) { console.error(e); }
    finally { setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(makeEmpty(filter));
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...s, topics: s.topics ?? "", completed: s.completed ?? "", progress: s.progress ?? "", streak: s.streak ?? "" });
    setShowModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        topics:    Number(form.topics)    || 0,
        completed: Number(form.completed) || 0,
        progress:  Number(form.progress)  || 0,
        streak:    Number(form.streak)    || 0,
      };
      if (!editing) {
        if (filter === "premium")  payload.type   = "premium";
        if (filter === "progress") payload.status = "In Progress";
      }
      if (editing) await subjectApi.update(editing._id, payload);
      else await subjectApi.create(payload);
      setShowModal(false);
      await refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to save. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    await subjectApi.remove(id);
    refresh();
  };

  // Filter logic — stays on current tab after save
  const filtered = subjects.filter(s => {
    if (filter === "progress") return s.status === "In Progress";
    if (filter === "premium")  return s.type === "premium";
    return true;
  });

  const totalProgress = subjects.length
    ? Math.round(subjects.reduce((a, s) => a + (s.progress || 0), 0) / subjects.length)
    : 0;

  const FILTER_LABEL = {
    all: "Add Subject",
    progress: "Add In Progress Subject",
    premium: "Add Premium Subject",
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {refreshing && (
        <div className="fixed top-4 right-4 z-50 bg-[#00aa59] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          Saving…
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Subjects" value={subjects.length}                                       color="#00aa59" icon={<MdSchool className="text-[#00aa59] text-2xl" />} />
        <StatCard label="Avg Progress"   value={`${totalProgress}%`}                                   color="#3B82F6" icon={<MdTrendingUp className="text-blue-500 text-2xl" />} />
        <StatCard label="Active"         value={subjects.filter(s => s.enabled).length}                color="#F59E0B" icon={<MdLocalFireDepartment className="text-amber-500 text-2xl" />} />
        <StatCard label="Completed"      value={subjects.filter(s => s.status === "Completed").length} color="#8B5CF6" icon={<MdCheckCircle className="text-purple-500 text-2xl" />} />
      </div>

      {/* Overall Progress Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[#00aa59]/10 flex items-center justify-center shrink-0">
          <MdTrendingUp className="text-[#00aa59] text-3xl" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-bold text-gray-800">Overall Progress</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {subjects.reduce((a, s) => a + (s.completed || 0), 0)} of {subjects.reduce((a, s) => a + (s.topics || 0), 0)} activities done
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-gray-800">{totalProgress}%</p>
              <p className="text-xs text-[#00aa59] font-semibold flex items-center gap-1 justify-end">
                <MdTrendingUp /> +12% from last week
              </p>
            </div>
          </div>
          <ProgressBar value={totalProgress} color="#00aa59" />
        </div>
        <div className="text-center shrink-0 pl-4 border-l border-gray-100">
          <p className="text-3xl font-extrabold text-gray-800">{subjects.filter(s => s.enabled).length}</p>
          <p className="text-xs text-gray-400 font-medium">Active</p>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { key: "all",      label: "All Subjects" },
            { key: "progress", label: "In Progress" },
            { key: "premium",  label: "Premium" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === f.key ? "bg-[#2C3E50] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {f.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                {f.key === "all" ? subjects.length : f.key === "progress" ? subjects.filter(s => s.status === "In Progress").length : subjects.filter(s => s.type === "premium").length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition shadow-sm">
          <MdAdd className="text-lg" /> {FILTER_LABEL[filter]}
        </button>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <MdInbox className="text-5xl mb-3" />
          <p className="text-sm font-medium mb-3">
            {filter === "progress" ? "No 'In Progress' subjects yet" :
             filter === "premium"  ? "No premium subjects added yet" :
             "No subjects found"}
          </p>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#00aa59] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#008f4a] transition">
            <MdAdd /> {FILTER_LABEL[filter]}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(s => (
            <SubjectCard key={s._id} s={s} onEdit={openEdit} onDelete={remove} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ModalWrap
          title={editing ? `Edit: ${editing.name}` : FILTER_LABEL[filter]}
          subtitle={editing ? "Update subject details below" : filter === "progress" ? "Status will be set to In Progress" : filter === "premium" ? "Type will be set to Premium" : "Fill in the subject details"}
          onClose={() => setShowModal(false)}
          onSave={save}
          valid={!!form.name.trim()}
          saving={saving}
        >
          {/* Subject Name — free text input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Subject Name *</label>
            <input
              className={inp}
              placeholder={
                filter === "premium" ? "e.g. Financial Literacy, Sex & Safety" :
                filter === "progress" ? "e.g. Math, English, Science / EVS" :
                "e.g. Math, English, Science / EVS…"
              }
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            {/* Quick name chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(filter === "premium"
                ? ["Financial Literacy", "Sex & Safety"]
                : ["Math", "Science / EVS", "English", "Social Studies", "Artificial Intelligence"]
              ).map(n => (
                <button key={n} type="button"
                  onClick={() => setForm(f => ({ ...f, name: n }))}
                  className={`text-xs px-2.5 py-1 rounded-full border transition ${form.name === n ? "bg-[#00aa59] text-white border-[#00aa59]" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#00aa59] hover:text-[#00aa59]"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea className={inp} placeholder="Subject description" rows={2} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Topics Count</label>
              <input className={inp} type="number" min="0" placeholder="0" value={form.topics}
                onChange={e => setForm(f => ({ ...f, topics: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Completed</label>
              <input className={inp} type="number" min="0" placeholder="0" value={form.completed}
                onChange={e => setForm(f => ({ ...f, completed: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Progress %</label>
              <input className={inp} type="number" min="0" max="100" placeholder="0" value={form.progress}
                onChange={e => setForm(f => ({ ...f, progress: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Streak (days)</label>
              <input className={inp} type="number" min="0" placeholder="0" value={form.streak}
                onChange={e => setForm(f => ({ ...f, streak: e.target.value }))} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
            <select className={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Type</label>
            <select className={inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="regular">Regular</option>
              <option value="premium">🔒 Premium</option>
            </select>
          </div>

          {/* Color */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</label>
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
            <span className="text-xs text-gray-400 font-mono">{form.color}</span>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} />
              Enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={form.isMostActive} onChange={e => setForm(f => ({ ...f, isMostActive: e.target.checked }))} />
              Most Active
            </label>
          </div>
        </ModalWrap>
      )}
    </div>
  );
};

export default AdminLearningSubjects;
