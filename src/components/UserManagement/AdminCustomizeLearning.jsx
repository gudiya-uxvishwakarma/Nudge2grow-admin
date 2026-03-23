import { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdAutoAwesome,
  MdCheckCircle, MdStar
} from "react-icons/md";
import { api } from "../../api";

const LEVELS = ["Basic", "Intermediate", "Advanced"];
const TYPES = ["core", "life_skill"];
const ICONS = ["📐", "🔬", "📖", "🌍", "🤖", "💰", "💡", "🛡️", "🎨", "🎵", "⚽", "🧠"];

const StepBar = ({ current }) => {
  const steps = ["Child Details", "Select Avatar", "Customize Learning"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${i === current ? "bg-[#45a578] text-white" : i < current ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold ${i === current ? "bg-white text-[#45a578]" : i < current ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}`}>{i + 1}</span>
            {s}
          </div>
          {i < steps.length - 1 && <div className={`h-0.5 w-6 rounded ${i < current ? "bg-green-400" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
};

// ── App-style phone preview ───────────────────────────────────────────────────
const PhonePreview = ({ items, selectedTopics, selectedLevel }) => {
  const core = items.filter(i => i.type === "core");
  const life = items.filter(i => i.type === "life_skill");

  return (
    <div className="w-52 rounded-3xl border-4 border-gray-800 bg-white shadow-2xl overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
      <div className="bg-white px-3 pt-4 pb-2 flex-1 overflow-hidden">
        <p className="text-xs font-bold text-[#45a578] mb-0.5">Topic Preferences</p>

        {/* Level selector */}
        <div className="flex gap-1 mb-3">
          {LEVELS.map(l => (
            <div key={l} className={`flex-1 py-1 rounded-full text-center text-[9px] font-bold ${selectedLevel === l ? "bg-[#45a578] text-white" : "bg-gray-100 text-gray-400"}`}>{l}</div>
          ))}
        </div>

        {core.length > 0 && (
          <>
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Core Area</p>
            <div className="grid grid-cols-2 gap-1 mb-2">
              {core.slice(0, 4).map(item => (
                <div key={item._id}
                  className={`rounded-lg p-1.5 border text-center ${selectedTopics.includes(item._id) ? "border-[#45a578] bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                  <div className="text-base">{item.icon || "📚"}</div>
                  <p className="text-[8px] font-semibold text-gray-700 leading-tight">{item.name}</p>
                  {item.isRecommended && <p className="text-[7px] text-[#45a578]">Recommended</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {life.length > 0 && (
          <>
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Life Skills</p>
            {life.slice(0, 3).map(item => (
              <div key={item._id}
                className={`flex items-center justify-between rounded-lg px-2 py-1 mb-1 border ${selectedTopics.includes(item._id) ? "border-[#45a578] bg-green-50" : "border-gray-200"}`}>
                <p className="text-[8px] font-semibold text-gray-700">{item.name}</p>
                <span className="text-xs">{item.icon || "✨"}</span>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="px-3 pb-3">
        <div className="w-full py-2 rounded-full text-center text-[10px] font-bold text-white bg-gradient-to-r from-cyan-400 via-[#45a578] to-green-300">Complete Setup</div>
      </div>
    </div>
  );
};

// ── Modal ─────────────────────────────────────────────────────────────────────
const EMPTY_ITEM = { name: "", icon: "📚", type: "core", levels: ["Basic", "Intermediate", "Advanced"], isActive: true, isRecommended: false, order: 0 };

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry, levels: entry.levels || LEVELS } : { ...EMPTY_ITEM });

  const toggleLevel = (l) => {
    setForm(p => ({
      ...p,
      levels: p.levels.includes(l) ? p.levels.filter(x => x !== l) : [...p.levels, l]
    }));
  };

  const valid = form.name.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#45a578] px-7 py-5 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Topic</> : <><MdAdd /> Add Topic</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
        </div>
        <div className="px-7 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Topic Name <span className="text-red-500">*</span></label>
            <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#45a578] transition"
              placeholder="e.g. Mathematics, Science..." value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Icon (emoji)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition ${form.icon === ic ? "border-[#45a578] bg-green-50 scale-110" : "border-gray-200 hover:border-gray-300"}`}>
                  {ic}
                </button>
              ))}
            </div>
            <input className="w-24 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#45a578] transition"
              placeholder="Custom" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
            <div className="flex gap-3">
              {TYPES.map(t => (
                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition ${form.type === t ? "border-[#45a578] bg-[#45a578]/10 text-[#45a578]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {t === "core" ? "📚 Core Area" : "✨ Life Skill"}
                </button>
              ))}
            </div>
          </div>

          {/* Levels */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Available Levels</label>
            <div className="flex gap-3">
              {LEVELS.map(l => (
                <button key={l} type="button" onClick={() => toggleLevel(l)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition ${form.levels.includes(l) ? "border-[#45a578] bg-[#45a578]/10 text-[#45a578]" : "border-gray-200 text-gray-400"}`}>
                  {l === "Basic" ? "🟢" : l === "Intermediate" ? "🟡" : "🔴"} {l}
                </button>
              ))}
            </div>
          </div>

          {/* Order + toggles */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Order</label>
              <input type="number" min={0} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#45a578] transition"
                value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-[#45a578]" />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isRecommended} onChange={e => setForm(p => ({ ...p, isRecommended: e.target.checked }))} className="w-4 h-4 accent-amber-400" />
                <span className="text-sm font-semibold text-gray-700">Recommended</span>
              </label>
            </div>
          </div>
        </div>
        <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#45a578] hover:bg-[#3a9068]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving…" : entry ? "Update" : "Add Topic"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminCustomizeLearning = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Basic");
  const [filterType, setFilterType] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.customizeLearning.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.customizeLearning.update(editItem._id, form);
      else await api.customizeLearning.create(form);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this topic?")) return;
    try { await api.customizeLearning.remove(id); await load(); } catch (e) { console.error(e); }
  };

  const filtered = filterType === "all" ? items : items.filter(i => i.type === filterType);
  const core = items.filter(i => i.type === "core");
  const life = items.filter(i => i.type === "life_skill");

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <StepBar current={2} />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#45a578] to-[#3a9068] flex items-center justify-center shadow-lg">
            <MdAutoAwesome className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Customize Learning</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage topics with Basic / Intermediate / Advanced levels</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#3a9068] transition">
          <MdAdd className="text-xl" /> Add Topic
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Topics", val: items.length, color: "text-[#45a578]", bg: "bg-green-50", icon: <MdAutoAwesome /> },
          { label: "Core Areas", val: core.length, color: "text-blue-500", bg: "bg-blue-50", icon: <MdStar /> },
          { label: "Life Skills", val: life.length, color: "text-purple-500", bg: "bg-purple-50", icon: <MdCheckCircle /> },
          { label: "Recommended", val: items.filter(i => i.isRecommended).length, color: "text-amber-500", bg: "bg-amber-50", icon: <MdStar /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
            <div><p className="text-xs text-gray-400 font-semibold uppercase">{s.label}</p><p className="text-3xl font-extrabold text-gray-800">{s.val}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Left: table */}
        <div className="flex-1">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {["all", "core", "life_skill"].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filterType === t ? "bg-[#45a578] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#45a578]/40"}`}>
                {t === "all" ? "All Topics" : t === "core" ? "📚 Core Area" : "✨ Life Skills"}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-[#45a578] to-[#3a9068] text-white text-sm">
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Topic</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Type</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Levels</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-20 text-gray-400">
                    <MdAutoAwesome className="text-6xl text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No topics yet. Add your first one!</p>
                  </td></tr>
                ) : filtered.map((item, i) => (
                  <tr key={item._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-green-50/30 transition-colors`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon || "📚"}</span>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                          {item.isRecommended && <span className="text-xs text-amber-500 font-semibold">⭐ Recommended</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.type === "core" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                        {item.type === "core" ? "Core" : "Life Skill"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        {(item.levels || LEVELS).map(l => (
                          <span key={l} className={`text-xs font-bold px-2 py-0.5 rounded-full ${l === "Basic" ? "bg-green-100 text-green-600" : l === "Intermediate" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                          className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdEdit /> Edit</button>
                        <button onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdDelete /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: phone preview */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">App Preview</p>
          <div className="flex gap-2 mb-1">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setSelectedLevel(l)}
                className={`px-2 py-1 rounded-full text-xs font-bold transition ${selectedLevel === l ? "bg-[#45a578] text-white" : "bg-gray-100 text-gray-400"}`}>{l}</button>
            ))}
          </div>
          <PhonePreview items={items} selectedTopics={selectedTopics} selectedLevel={selectedLevel} />
          <p className="text-xs text-gray-400 text-center">Click topics in preview to select</p>
        </div>
      </div>

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

export default AdminCustomizeLearning;
