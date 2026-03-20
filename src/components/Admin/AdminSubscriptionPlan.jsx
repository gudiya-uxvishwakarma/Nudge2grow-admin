import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox, MdTrendingUp, MdCreditCard, MdCheckCircle, MdStar, MdAutoAwesome, MdVisibility } from "react-icons/md";
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
    <span className="flex items-center gap-0.5 text-xs font-bold px-3 py-1.5 rounded-full"
      style={{ backgroundColor: `${color}18`, color }}>
      <MdTrendingUp className="text-sm" />{change}
    </span>
  </div>
);

const EMPTY_PLAN = {
  name: "", tagline: "", monthlyPrice: "", yearlyPrice: "",
  pricingType: "monthly", popular: false, recommended: false,
  features: [], status: "active",
};

const EMPTY_TESTIMONIAL = { name: "", role: "", rating: "5", text: "", photo: "" };

const compressPhoto = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 80; canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2, sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 80, 80);
      cb(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const inp =
  "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

// ── Plan Modal ────────────────────────────────────────────────────────────────
const PlanModal = ({ entry, onSave, onClose }) => {
  const [form, setForm] = useState(
    entry
      ? { ...entry, features: Array.isArray(entry.features) ? entry.features : [] }
      : { ...EMPTY_PLAN }
  );
  const [featInput, setFeatInput] = useState("");
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const valid = form.name.trim() !== "";

  const addFeature = () => {
    const val = featInput.trim();
    if (!val) return;
    setForm((p) => ({ ...p, features: [...p.features, val] }));
    setFeatInput("");
  };
  const removeFeature = (idx) =>
    setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {entry ? <><MdEdit /> Edit Plan</> : <><MdAdd /> Add New Plan</>}
            </h2>
            <p className="text-white/80 text-sm mt-0.5">Subscription Plan</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Premium" value={form.name} onChange={f("name")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tagline</label>
            <input className={inp} placeholder="e.g. Most popular choice" value={form.tagline} onChange={f("tagline")} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Pricing Type</label>
            <select className={inp} value={form.pricingType} onChange={f("pricingType")}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="both">Both (Monthly &amp; Yearly)</option>
            </select>
          </div>

          {(form.pricingType === "monthly" || form.pricingType === "both") && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Monthly Price (₹)</label>
              <input className={inp} type="number" placeholder="299" value={form.monthlyPrice} onChange={f("monthlyPrice")} />
            </div>
          )}
          {(form.pricingType === "yearly" || form.pricingType === "both") && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Yearly Price (₹)</label>
              <input className={inp} type="number" placeholder="2999" value={form.yearlyPrice} onChange={f("yearlyPrice")} />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
            <select className={inp} value={form.status} onChange={f("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#00aa59]" checked={!!form.popular}
                onChange={(e) => setForm((p) => ({ ...p, popular: e.target.checked }))} />
              <span className="text-sm font-semibold text-gray-700">Popular Badge</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#00aa59]" checked={!!form.recommended}
                onChange={(e) => setForm((p) => ({ ...p, recommended: e.target.checked }))} />
              <span className="text-sm font-semibold text-gray-700">Best Value Badge</span>
            </label>
          </div>

          {/* Features — dynamic list */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inp}
                placeholder="e.g. Unlimited nudges"
                value={featInput}
                onChange={(e) => setFeatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature}
                className="shrink-0 bg-[#00aa59] hover:bg-[#008f4a] text-white px-4 rounded-xl text-sm font-bold transition flex items-center gap-1">
                <MdAdd /> Add
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {form.features.map((feat, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-sm text-gray-700">✓ {feat}</span>
                    <button type="button" onClick={() => removeFeature(i)}
                      className="text-red-400 hover:text-red-600 transition ml-2">
                      <MdClose className="text-base" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {form.features.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No features added yet. Type above and click Add.</p>
            )}
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onSave(form)}
            className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}
          >
            <MdSave /> {entry ? "Update" : "Add Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Testimonial Modal ─────────────────────────────────────────────────────────
const TestimonialModal = ({ entry, onSave, onClose }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY_TESTIMONIAL });
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
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {entry ? <><MdEdit /> Edit Testimonial</> : <><MdAdd /> Add Testimonial</>}
            </h2>
            <p className="text-white/80 text-sm mt-0.5">Subscription Plan</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#00aa59]/30 bg-gray-100 flex items-center justify-center shrink-0">
              {form.photo
                ? <img src={form.photo} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-gray-400">{form.name?.charAt(0)?.toUpperCase() || "?"}</span>
              }
            </div>
            <label className="cursor-pointer bg-[#00aa59]/10 hover:bg-[#00aa59]/20 text-[#00aa59] text-xs font-semibold px-4 py-2 rounded-xl transition border border-[#00aa59]/30">
              {form.photo ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            {form.photo && (
              <button type="button" onClick={() => setForm((p) => ({ ...p, photo: "" }))}
                className="text-xs text-red-400 hover:text-red-600 transition">
                Remove Photo
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Priya Sharma" value={form.name} onChange={f("name")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
            <input className={inp} placeholder="e.g. Mother of Child" value={form.role} onChange={f("role")} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
            <select className={inp} value={form.rating} onChange={f("rating")}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Review Text <span className="text-red-500">*</span></label>
            <textarea rows={4} className={`${inp} resize-none`} placeholder="Write the review…" value={form.text} onChange={f("text")} />
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => valid && onSave(form)}
            className={`px-8 py-2.5 rounded-xl text-white text-sm font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}
          >
            <MdSave /> {entry ? "Update" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminSubscriptionPlan = () => {
  const [activeTab, setActiveTab] = useState("plans");

  const [plans, setPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [planModal, setPlanModal] = useState(false);
  const [editPlanEntry, setEditPlanEntry] = useState(null);

  const [testModal, setTestModal] = useState(false);
  const [editTestEntry, setEditTestEntry] = useState(null);

  const [viewPlan, setViewPlan] = useState(null);
  const [viewTest, setViewTest] = useState(null);

  // ── Load both on mount ──
  const loadAll = async () => {
    setLoading(true);
    try {
      const [plansRes, testsRes] = await Promise.all([
        api.plans.getAll(),
        api.testimonials.getAll(),
      ]);
      setPlans(plansRes.data || plansRes || []);
      setTestimonials(testsRes.data || testsRes || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  // ── Plans CRUD ──
  const handleSavePlan = async (form) => {
    setSaving(true);
    try {
      if (editPlanEntry) await api.plans.update(editPlanEntry._id, form);
      else await api.plans.create(form);
      setPlanModal(false); setEditPlanEntry(null);
      await loadAll();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try { await api.plans.remove(id); await loadAll(); }
    catch (e) { console.error(e); }
  };

  // ── Testimonials CRUD ──
  const handleSaveTest = async (form) => {
    setSaving(true);
    try {
      if (editTestEntry) await api.testimonials.update(editTestEntry._id, form);
      else await api.testimonials.create(form);
      setTestModal(false); setEditTestEntry(null);
      await loadAll();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try { await api.testimonials.remove(id); await loadAll(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── PAGE HEADER ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Subscription Management</h1>
        <p className="text-gray-500 mt-0.5 text-sm">Manage subscription plans and testimonials</p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <SC label="Total Plans"value={plans.length}                              change="+1"  color="#00aa59" icon={<MdCreditCard />} />
        <SC label="Active Plans"value={plans.filter(p=>p.status!=="inactive").length} change="+1" color="#4F8EF7" icon={<MdCheckCircle />} />
        <SC label="Testimonials"value={testimonials.length}                       change="+3"  color="#F6C72A" icon={<MdStar />} />
        <SC label="Avg Rating"value={testimonials.length ? (testimonials.reduce((s,t)=>s+Number(t.rating||5),0)/testimonials.length).toFixed(1)+"★" : "—"} change="+0.2" color="#EC4899" icon={<MdAutoAwesome />} />
      </div>

      {/* Tab Buttons + Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition border-2 ${activeTab === "plans" ? "bg-[#00aa59] text-white border-[#00aa59] shadow" : "bg-white text-gray-600 border-gray-200 hover:border-[#00aa59]/50"}`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition border-2 ${activeTab === "testimonials" ? "bg-[#00aa59] text-white border-[#00aa59] shadow" : "bg-white text-gray-600 border-gray-200 hover:border-[#00aa59]/50"}`}
          >
            Testimonials
          </button>
        </div>

        {activeTab === "plans" ? (
          <button onClick={() => { setEditPlanEntry(null); setPlanModal(true); }}
            className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
            <MdAdd className="text-xl" /> Add Plan
          </button>
        ) : (
          <button onClick={() => { setEditTestEntry(null); setTestModal(true); }}
            className="flex items-center gap-2 bg-[#00aa59] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#008f4a] transition">
            <MdAdd className="text-xl" /> Add Testimonial
          </button>
        )}
      </div>

      {/* Plans Table */}
      {activeTab === "plans" && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#00aa59] text-white text-sm">
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">No.</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Plan Name</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Tagline</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Price</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Badges</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Features</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <MdInbox className="text-6xl text-gray-300" />
                        <p className="font-medium">No plans yet</p>
                        <p className="text-sm">Click &quot;+ Add Plan&quot; to create your first one</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plans.map((plan, i) => (
                    <tr key={plan._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                      <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800 text-sm">{plan.name || "—"}</td>
                      <td className="px-5 py-4 text-gray-500 text-sm max-w-[160px] truncate">{plan.tagline || "—"}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {plan.pricingType === "monthly" && plan.monthlyPrice !== "" && (
                          <span className="inline-flex items-center bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full">₹{plan.monthlyPrice}/mo</span>
                        )}
                        {plan.pricingType === "yearly" && plan.yearlyPrice !== "" && (
                          <span className="inline-flex items-center bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">₹{plan.yearlyPrice}/yr</span>
                        )}
                        {plan.pricingType === "both" && (
                          <div className="flex flex-col gap-1">
                            {plan.monthlyPrice !== "" && <span className="inline-flex items-center bg-[#00aa59]/10 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full">₹{plan.monthlyPrice}/mo</span>}
                            {plan.yearlyPrice !== "" && <span className="inline-flex items-center bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">₹{plan.yearlyPrice}/yr</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {plan.popular && <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">Popular</span>}
                          {plan.recommended && <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">Best Value</span>}
                          {!plan.popular && !plan.recommended && <span className="text-gray-400 text-sm">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {Array.isArray(plan.features) && plan.features.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {plan.features.map((feat, fi) => (
                              <span key={fi} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">✓ {feat}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {plan.status === "inactive" ? (
                          <span className="inline-flex items-center bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">Inactive</span>
                        ) : (
                          <span className="inline-flex items-center bg-green-50 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full border border-green-200">Active</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => setViewPlan(plan)}
                            className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                            <MdVisibility /> View
                          </button>
                          <button onClick={() => { setEditPlanEntry(plan); setPlanModal(true); }}
                            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                            <MdEdit /> Edit
                          </button>
                          <button onClick={() => handleDeletePlan(plan._id)}
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
      )}

      {/* Testimonials Table */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#00aa59] text-white text-sm">
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">No.</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Name</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Role</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Rating</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">Review</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <MdInbox className="text-6xl text-gray-300" />
                        <p className="font-medium">No testimonials yet</p>
                        <p className="text-sm">Click &quot;+ Add Testimonial&quot; to create your first one</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  testimonials.map((t, i) => (
                    <tr key={t._id} className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5`}>
                      <td className="px-5 py-4 text-gray-400 text-sm">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 bg-[#00aa59] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {t.photo
                              ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                              : t.name?.charAt(0)?.toUpperCase() || "?"
                            }
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{t.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-sm">{t.role || "—"}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                          {"★".repeat(Number(t.rating) || 5)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm max-w-[260px] truncate italic">&quot;{t.text || "—"}&quot;</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => setViewTest(t)}
                            className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                            <MdVisibility /> View
                          </button>
                          <button onClick={() => { setEditTestEntry(t); setTestModal(true); }}
                            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                            <MdEdit /> Edit
                          </button>
                          <button onClick={() => handleDeleteTest(t._id)}
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
      )}

      {planModal && (
        <PlanModal entry={editPlanEntry} onSave={handleSavePlan} onClose={() => { setPlanModal(false); setEditPlanEntry(null); }} saving={saving} />
      )}
      {testModal && (
        <TestimonialModal entry={editTestEntry} onSave={handleSaveTest} onClose={() => { setTestModal(false); setEditTestEntry(null); }} saving={saving} />
      )}

      {/* View Plan Modal */}
      {viewPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><MdVisibility /> Plan Details</h2>
                <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
              </div>
              <button onClick={() => setViewPlan(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Hero */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#00aa59]/10 flex items-center justify-center mx-auto mb-3">
                  <MdCreditCard className="text-3xl text-[#00aa59]" />
                </div>
                <p className="font-extrabold text-gray-800 text-xl">{viewPlan.name}</p>
                {viewPlan.tagline && <p className="text-sm text-gray-500 mt-1">{viewPlan.tagline}</p>}
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {viewPlan.popular && <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">Popular</span>}
                  {viewPlan.recommended && <span className="bg-green-50 text-[#00aa59] text-xs font-semibold px-3 py-1 rounded-full border border-green-200">Best Value</span>}
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${viewPlan.status === "inactive" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-[#00aa59] border-green-200"}`}>
                    {viewPlan.status === "inactive" ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                {viewPlan.monthlyPrice !== "" && viewPlan.monthlyPrice !== undefined && (
                  <div className="bg-[#00aa59]/5 rounded-xl p-4 border border-green-100 text-center">
                    <p className="text-xs font-bold text-[#00aa59] uppercase tracking-wide mb-1">Monthly</p>
                    <p className="text-2xl font-extrabold text-gray-800">₹{viewPlan.monthlyPrice}</p>
                  </div>
                )}
                {viewPlan.yearlyPrice !== "" && viewPlan.yearlyPrice !== undefined && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Yearly</p>
                    <p className="text-2xl font-extrabold text-gray-800">₹{viewPlan.yearlyPrice}</p>
                  </div>
                )}
              </div>
              {/* Features */}
              {Array.isArray(viewPlan.features) && viewPlan.features.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Features</p>
                  <div className="flex flex-col gap-2">
                    {viewPlan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <MdCheckCircle className="text-[#00aa59] text-base shrink-0" />
                        <span className="text-sm text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewPlan(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* View Testimonial Modal */}
      {viewTest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><MdVisibility /> Testimonial Details</h2>
                <p className="text-white/70 text-xs mt-0.5">Read-only view</p>
              </div>
              <button onClick={() => setViewTest(null)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Profile hero */}
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#00aa59]/30 bg-[#00aa59] flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {viewTest.photo
                    ? <img src={viewTest.photo} alt={viewTest.name} className="w-full h-full object-cover" />
                    : viewTest.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-extrabold text-gray-800 text-base">{viewTest.name}</p>
                  {viewTest.role && <p className="text-xs text-gray-500 mt-0.5">{viewTest.role}</p>}
                  <span className="inline-flex items-center bg-amber-50 text-amber-700 text-sm font-bold px-3 py-1 rounded-full border border-amber-200 mt-2">
                    {"★".repeat(Number(viewTest.rating) || 5)}
                  </span>
                </div>
              </div>
              {/* Review text */}
              {viewTest.text && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Review</p>
                  <p className="text-sm text-gray-700 italic leading-relaxed">&quot;{viewTest.text}&quot;</p>
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewTest(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionPlan;
