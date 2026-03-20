// import { useState } from "react";
// import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdTrendingUp, MdFlag, MdCheckCircle, MdDirectionsRun, MdFolder, MdMenuBook, MdFavorite, MdSportsScore, MdPalette, MdStar, MdPushPin, MdVisibility } from "react-icons/md";

// const inp =
//   "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

// const SC = ({ label, value, change, color, icon }) => (
//   <div className="bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
//     <div className="flex items-center gap-4">
//       <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: `${color}18` }}>{icon}</div>
//       <div>
//         <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
//         <p className="text-3xl font-extrabold text-gray-800 leading-none">{value}</p>
//       </div>
//     </div>
//     <span className="flex items-center gap-0.5 text-xs font-bold px-3 py-1.5 rounded-full"
//       style={{ backgroundColor: `${color}18`, color }}>
//       <MdTrendingUp className="text-sm" />{change}
//     </span>
//   </div>
// );

// const CATEGORIES = ["Academic", "Emotional & Social", "Physical", "Creative", "Life Skills", "Other"];
// const CATEGORY_COLORS = {
//   "Academic": "#4FC3F7", "Emotional & Social": "#FFB84D", "Physical": "#4CAF50",
//   "Creative": "#E91E63", "Life Skills": "#8B5CF6", "Other": "#6B7280",
// };
// const CATEGORY_ICONS = {
//   "Academic": <MdMenuBook />, "Emotional & Social": <MdFavorite />, "Physical": <MdDirectionsRun />,
//   "Creative": <MdPalette />, "Life Skills": <MdStar />, "Other": <MdPushPin />,
// };

// const EMPTY_MILESTONE = { title: "", category: "Academic", completed: false, status: "active" };
// const EMPTY_ACTIVITY  = { title: "", category: "Academic", time: "", skills: "", ageRange: "", description: "", status: "active" };
// const EMPTY_CATEGORY  = { name: "Academic", color: "#4FC3F7", status: "active" };

// const TABS = [
//   { key: "milestones", label: "Milestones" },
//   { key: "activities", label: "Activities" },
//   { key: "categories", label: "Categories" },
// ];

// const ModalWrap = ({ title, subtitle, onClose, onSave, valid, children }) => (
//   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
//       <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-extrabold text-white">{title}</h2>
//           {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
//         </div>
//         <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
//           <MdClose className="text-xl" />
//         </button>
//       </div>
//       <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
//       <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
//         <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
//           Cancel
//         </button>
//         <button disabled={!valid} onClick={onSave}
//           className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
//           <MdSave /> Save
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const AdminMilestones = () => {
//   const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };
//   const persist = (key, setter, data) => { setter(data); localStorage.setItem(key, JSON.stringify(data)); };

//   const [activeTab,   setActiveTab]   = useState("milestones");
//   const [milestones,  setMilestones]  = useState(() => load("ms_milestones", []));
//   const [activities,  setActivities]  = useState(() => load("ms_activities", []));
//   const [categories,  setCategories]  = useState(() => load("ms_categories", []));

//   const [modal, setModal] = useState(null);
//   const [form,  setForm]  = useState({});
//   const [viewItem, setViewItem] = useState(null);
//   const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

//   const getList = (type) => ({ milestones, activities, categories }[type]);
//   const setList = (type, data) => {
//     const map = {
//       milestones: [setMilestones, "ms_milestones"],
//       activities: [setActivities, "ms_activities"],
//       categories: [setCategories, "ms_categories"],
//     };
//     persist(map[type][1], map[type][0], data);
//   };

//   const openAdd  = (type, empty) => { setForm({ ...empty }); setModal({ type, id: null }); };
//   const openEdit = (type, id)    => { setForm({ ...getList(type).find((x) => x._id === id) }); setModal({ type, id }); };
//   const closeModal = () => setModal(null);

//   const handleSave = () => {
//     const entry = { ...form, _id: modal.id ?? Date.now() };
//     const list  = getList(modal.type);
//     setList(modal.type, modal.id !== null ? list.map((x) => x._id === modal.id ? entry : x) : [...list, entry]);
//     closeModal();
//   };

//   const handleDelete = (type, id) => {
//     if (!window.confirm("Delete this entry?")) return;
//     setList(type, getList(type).filter((x) => x._id !== id));
//   };

//   const isValid = () => {
//     if (!modal) return false;
//     if (modal.type === "milestones") return !!form.title?.trim();
//     if (modal.type === "activities") return !!form.title?.trim();
//     if (modal.type === "categories") return !!form.name?.trim();
//     return false;
//   };

//   const emptyState = (msg) => (
//     <tr><td colSpan={10} className="text-center py-20 text-gray-400">
//       <div className="flex flex-col items-center gap-3">
//         <MdInbox className="text-6xl text-gray-300" />
//         <p className="font-medium">{msg}</p>
//         <p className="text-sm">Click &quot;+ Add&quot; to create your first one</p>
//       </div>
//     </td></tr>
//   );

//   const statusBadge = (s) => s === "active"
//     ? <span className="bg-green-50 text-[#00aa59] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">Active</span>
//     : <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">Inactive</span>;

//   const actionBtns = (type, id) => (
//     <div className="flex gap-2 justify-center">
//       <button onClick={() => setViewItem({ type, item: getList(type).find((x) => x._id === id) })} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdVisibility /> View</button>
//       <button onClick={() => openEdit(type, id)} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdEdit /> Edit</button>
//       <button onClick={() => handleDelete(type, id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><MdDelete /> Delete</button>
//     </div>
//   );

//   const tableWrap = (cols, body) => (
//     <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-[#00aa59] text-white text-sm">
//               <th className="px-5 py-4 font-bold uppercase tracking-wider">#</th>
//               {cols.map((c) => <th key={c} className={`px-5 py-4 font-bold uppercase tracking-wider ${c === "Actions" ? "text-center" : ""}`}>{c}</th>)}
//             </tr>
//           </thead>
//           <tbody>{body}</tbody>
//         </table>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">

//       {/* ── PAGE HEADER ── */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Milestones Management</h1>
//         <p className="text-gray-500 mt-0.5 text-sm">Manage child developmental milestones, activities and categories</p>
//       </div>

//       {/* ── STATS ── */}
//       <div className="grid grid-cols-4 gap-3 mb-6">
//         <SC label="Milestones"   value={milestones.length}                        change="+3"  color="#4FC3F7" icon={<MdSportsScore />} />
//         <SC label="Completed"    value={milestones.filter(m=>m.completed).length} change="+2"  color="#00aa59" icon={<MdCheckCircle />} />
//         <SC label="Activities"   value={activities.length}                        change="+5"  color="#FFB84D" icon={<MdDirectionsRun />} />
//         <SC label="Categories"   value={categories.length}                        change="+1"  color="#8B5CF6" icon={<MdFolder />} />
//       </div>

//       {/* Tabs + Add */}
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//         <div className="flex gap-2 flex-wrap">
//           {TABS.map((tab) => (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)}
//               className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition border-2 ${activeTab === tab.key ? "bg-[#00aa59] text-white border-[#00aa59] shadow" : "bg-white text-gray-600 border-gray-200 hover:border-[#00aa59]/50"}`}>
//               {tab.label}
//             </button>
//           ))}
//         </div>
//         <button onClick={() => openAdd(activeTab, activeTab === "milestones" ? EMPTY_MILESTONE : activeTab === "activities" ? EMPTY_ACTIVITY : EMPTY_CATEGORY)}
//           className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
//           <MdAdd className="text-xl" /> Add {TABS.find((t) => t.key === activeTab)?.label.replace(/s$/, "")}
//         </button>
//       </div>

//       {/* Milestones Table */}
//       {activeTab === "milestones" && tableWrap(
//         ["Title", "Category", "Completed", "Status", "Actions"],
//         milestones.length === 0 ? emptyState("No milestones yet") :
//         milestones.map((m, i) => {
//           const color = CATEGORY_COLORS[m.category] || "#6B7280";
//           const catIcon = CATEGORY_ICONS[m.category] || <MdPushPin />;
//           return (
//             <tr key={m._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
//               <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
//               <td className="px-5 py-4 font-semibold text-gray-800 text-sm">{m.title}</td>
//               <td className="px-5 py-4">
//                 <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
//                   style={{ backgroundColor: `${color}15`, color, borderColor: `${color}40` }}>
//                   {catIcon} {m.category}
//                 </span>
//               </td>
//               <td className="px-5 py-4">
//                 {m.completed
//                   ? <span className="bg-green-50 text-[#00aa59] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">✓ Done</span>
//                   : <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">Pending</span>}
//               </td>
//               <td className="px-5 py-4">{statusBadge(m.status)}</td>
//               <td className="px-5 py-4">{actionBtns("milestones", m._id)}</td>
//             </tr>
//           );
//         })
//       )}

//       {/* Activities Table */}
//       {activeTab === "activities" && tableWrap(
//         ["Title", "Category", "Time", "Age Range", "Skills", "Status", "Actions"],
//         activities.length === 0 ? emptyState("No activities yet") :
//         activities.map((a, i) => {
//           const color = CATEGORY_COLORS[a.category] || "#6B7280";
//           const catIcon = CATEGORY_ICONS[a.category] || <MdPushPin />;
//           return (
//             <tr key={a._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
//               <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
//               <td className="px-5 py-4 font-semibold text-gray-800 text-sm">{a.title}</td>
//               <td className="px-5 py-4">
//                 <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
//                   style={{ backgroundColor: `${color}15`, color, borderColor: `${color}40` }}>
//                   {catIcon} {a.category}
//                 </span>
//               </td>
//               <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{a.time || "—"}</td>
//               <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{a.ageRange || "—"}</td>
//               <td className="px-5 py-4 text-sm text-gray-500 max-w-[140px] truncate">{a.skills || "—"}</td>
//               <td className="px-5 py-4">{statusBadge(a.status)}</td>
//               <td className="px-5 py-4">{actionBtns("activities", a._id)}</td>
//             </tr>
//           );
//         })
//       )}

//       {/* Categories Table */}
//       {activeTab === "categories" && tableWrap(
//         ["Name", "Color", "Status", "Actions"],
//         categories.length === 0 ? emptyState("No categories yet") :
//         categories.map((c, i) => (
//           <tr key={c._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
//             <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
//             <td className="px-5 py-4 font-semibold text-gray-800 text-sm flex items-center gap-2">
//               <span className="text-base" style={{ color: CATEGORY_COLORS[c.name] || "#6B7280" }}>{CATEGORY_ICONS[c.name] || <MdPushPin />}</span> {c.name}
//             </td>
//             <td className="px-5 py-4">
//               <span className="inline-block w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c.color || "#ccc" }} />
//             </td>
//             <td className="px-5 py-4">{statusBadge(c.status)}</td>
//             <td className="px-5 py-4">{actionBtns("categories", c._id)}</td>
//           </tr>
//         ))
//       )}

//       {/* Milestone Modal */}
//       {modal?.type === "milestones" && (
//         <ModalWrap title={modal.id ? "Edit Milestone" : "Add Milestone"} subtitle="Child developmental milestone" onClose={closeModal} onSave={handleSave} valid={isValid()}>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
//             <input className={inp} placeholder="e.g. Reads & Summarizes Stories" value={form.title || ""} onChange={f("title")} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
//             <select className={inp} value={form.category || "Academic"} onChange={f("category")}>
//               {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//             </select>
//           </div>
//           <div className="flex gap-6">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" className="w-4 h-4 accent-[#00aa59]" checked={!!form.completed}
//                 onChange={(e) => setForm((p) => ({ ...p, completed: e.target.checked }))} />
//               <span className="text-sm font-semibold text-gray-700">Completed</span>
//             </label>
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
//             <select className={inp} value={form.status || "active"} onChange={f("status")}>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </ModalWrap>
//       )}

//       {/* Activity Modal */}
//       {modal?.type === "activities" && (
//         <ModalWrap title={modal.id ? "Edit Activity" : "Add Activity"} subtitle="Learning activity details" onClose={closeModal} onSave={handleSave} valid={isValid()}>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
//             <input className={inp} placeholder="e.g. Story Time" value={form.title || ""} onChange={f("title")} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
//             <select className={inp} value={form.category || "Academic"} onChange={f("category")}>
//               {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//             </select>
//           </div>
//           <div className="flex gap-3">
//             <div className="flex-1">
//               <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
//               <input className={inp} placeholder="e.g. 20 minutes" value={form.time || ""} onChange={f("time")} />
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-bold text-gray-700 mb-1">Age Range</label>
//               <input className={inp} placeholder="e.g. 3-6 years" value={form.ageRange || ""} onChange={f("ageRange")} />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Skills</label>
//             <input className={inp} placeholder="e.g. Reading, Comprehension" value={form.skills || ""} onChange={f("skills")} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
//             <textarea rows={4} className={`${inp} resize-none`} placeholder="Activity description…" value={form.description || ""} onChange={f("description")} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
//             <select className={inp} value={form.status || "active"} onChange={f("status")}>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </ModalWrap>
//       )}

//       {/* Category Modal */}
//       {modal?.type === "categories" && (
//         <ModalWrap title={modal.id ? "Edit Category" : "Add Category"} subtitle="Milestone category" onClose={closeModal} onSave={handleSave} valid={isValid()}>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
//             <select className={inp} value={form.name || "Academic"}
//               onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, color: CATEGORY_COLORS[e.target.value] || "#6B7280" }))}>
//               {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Color</label>
//             <input type="color" className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
//               value={form.color || "#4FC3F7"} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
//             <select className={inp} value={form.status || "active"} onChange={f("status")}>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </ModalWrap>
//       )}

//       {/* View Modal */}
//       {viewItem && (() => {
//         const it = viewItem.item;
//         const type = viewItem.type;
//         const color = CATEGORY_COLORS[it.category || it.name] || "#6B7280";
//         const catIcon = CATEGORY_ICONS[it.category || it.name] || <MdPushPin />;
//         return (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
//               <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
//                 <div>
//                   <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
//                     <MdVisibility /> {type === "milestones" ? "Milestone" : type === "activities" ? "Activity" : "Category"} Details
//                   </h2>
//                   <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
//                 </div>
//                 <button onClick={() => setViewItem(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
//                   <MdClose className="text-xl" />
//                 </button>
//               </div>
//               <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
//                 {/* Hero */}
//                 <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
//                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
//                     style={{ backgroundColor: `${color}20`, color }}>
//                     {catIcon}
//                   </div>
//                   <div>
//                     <p className="font-extrabold text-gray-800 text-base">{it.title || it.name}</p>
//                     {it.category && <p className="text-xs mt-1 font-semibold" style={{ color }}>{it.category}</p>}
//                     {it.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{it.description}</p>}
//                   </div>
//                 </div>
//                 {/* Activity details grid */}
//                 {type === "activities" && (
//                   <div className="grid grid-cols-2 gap-3">
//                     {[
//                       { label: "Time", val: it.time, color: "#4F8EF7" },
//                       { label: "Age Range", val: it.ageRange, color: "#8B5CF6" },
//                       { label: "Skills", val: it.skills, color: "#F6C72A" },
//                     ].filter(i => i.val).map(({ label, val, color: c }) => (
//                       <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
//                         <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: c }}>{label}</p>
//                         <p className="text-sm font-semibold text-gray-800">{val}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {/* Category color swatch */}
//                 {type === "categories" && it.color && (
//                   <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
//                     <span className="w-8 h-8 rounded-full border-2 border-white shadow shrink-0" style={{ backgroundColor: it.color }} />
//                     <span className="text-sm font-mono text-gray-600">{it.color}</span>
//                   </div>
//                 )}
//                 {/* Status + completion badges */}
//                 <div className="flex flex-wrap gap-2">
//                   {statusBadge(it.status)}
//                   {type === "milestones" && (it.completed
//                     ? <span className="bg-green-50 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full border border-green-200">✓ Completed</span>
//                     : <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">Pending</span>)}
//                 </div>
//               </div>
//               <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
//                 <button onClick={() => setViewItem(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
//               </div>
//             </div>
//           </div>
//         );
//       })()}
//     </div>
//   );
// };

// export default AdminMilestones;
