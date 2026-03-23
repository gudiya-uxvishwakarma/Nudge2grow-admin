import { useState, useEffect } from "react";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdInbox,
  MdCreditCard, MdCheckCircle, MdVisibility
} from "react-icons/md";
import { api } from "../../../api";

const EMPTY_PLAN = {
  name: "", tagline: "", monthlyPrice: "", yearlyPrice: "",
  pricingType: "monthly", popular: false, recommended: false,
  features: [], status: "active",
};

const inp = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#00aa59] focus:ring-4 focus:ring-[#00aa59]/10 transition bg-white";

const PlanModal = ({ entry, onSave, onClose }) => {
  const [form, setForm] = useState(
    entry ? { ...entry, features: Array.isArray(entry.features) ? entry.features : [] } : { ...EMPTY_PLAN }
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
  const removeFeature = (idx) => setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Plan</> : <><MdAdd /> Add New Plan</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
            <input className={inp} placeholder="e.g. Premium" value={form.name} onChange={f("name")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Tagline</label>
            <input className={inp} placeholder="e.g. Most popular choice" value={form.tagline} onChange={f("tagline")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Pricing Type</label>
            <select className={inp} value={form.pricingType} onChange={f("pricingType")}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="both">Both (Monthly &amp; Yearly)</option>
            </select>
          </div>
          {(form.pricingType === "monthly" || form.pricingType === "both") && (
            <div>
              <label className="block text-base font-bold text-gray-700 mb-1">Monthly Price (₹)</label>
              <input className={inp} type="number" placeholder="299" value={form.monthlyPrice} onChange={f("monthlyPrice")} />
            </div>
          )}
          {(form.pricingType === "yearly" || form.pricingType === "both") && (
            <div>
              <label className="block text-base font-bold text-gray-700 mb-1">Yearly Price (₹)</label>
              <input className={inp} type="number" placeholder="2999" value={form.yearlyPrice} onChange={f("yearlyPrice")} />
            </div>
          )}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Status</label>
            <select className={inp} value={form.status} onChange={f("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#00aa59]" checked={!!form.popular}
                onChange={(e) => setForm((p) => ({ ...p, popular: e.target.checked }))} />
              <span className="text-base font-semibold text-gray-700">Popular Badge</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#00aa59]" checked={!!form.recommended}
                onChange={(e) => setForm((p) => ({ ...p, recommended: e.target.checked }))} />
              <span className="text-base font-semibold text-gray-700">Best Value Badge</span>
            </label>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input className={inp} placeholder="e.g. Unlimited nudges" value={featInput}
                onChange={(e) => setFeatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
              <button type="button" onClick={addFeature}
                className="shrink-0 bg-[#00aa59] hover:bg-[#008f4a] text-white px-4 rounded-xl text-base font-bold transition flex items-center gap-1">
                <MdAdd /> Add
              </button>
            </div>
            {form.features.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {form.features.map((feat, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-base text-gray-700">✓ {feat}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 transition ml-2">
                      <MdClose className="text-base" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1">No features added yet.</p>
            )}
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button disabled={!valid} onClick={() => valid && onSave(form)}
            className={`px-8 py-2.5 rounded-xl text-white text-base font-bold transition shadow flex items-center gap-2 ${valid ? "bg-[#00aa59] hover:bg-[#008f4a]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {entry ? "Update" : "Add Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planModal, setPlanModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [viewPlan, setViewPlan] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const res = await api.plans.getAll(); setPlans(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    try {
      if (editEntry) await api.plans.update(editEntry._id, form);
      else await api.plans.create(form);
      setPlanModal(false); setEditEntry(null); await load();
    } catch (e) { console.error(e); alert("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try { await api.plans.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#00aa59] flex items-center justify-center shadow-lg shrink-0">
            <MdCreditCard className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Subscription Plans</h1>
            <p className="text-gray-500 text-base mt-1">Manage all subscription plans</p>
          </div>
        </div>
        <button onClick={() => { setEditEntry(null); setPlanModal(true); }}
          className="flex items-center gap-2 bg-[#00aa59] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#008f4a] transition">
          <MdAdd className="text-2xl" /> Add Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#00aa59] text-white">
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">No.</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Plan Name</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Tagline</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Price</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Badges</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Features</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base">Status</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-base text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-20 text-gray-400">
                <MdInbox className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No plans yet. Add your first one!</p>
              </td></tr>
            ) : plans.map((plan, i) => (
              <tr key={plan._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-[#00aa59]/5 transition-colors`}>
                <td className="px-5 py-4 text-gray-400 text-base">{i + 1}</td>
                <td className="px-5 py-4 font-semibold text-gray-800 text-base">{plan.name || "—"}</td>
                <td className="px-5 py-4 text-gray-500 text-base max-w-[160px] truncate">{plan.tagline || "—"}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {plan.pricingType === "monthly" && <span className="bg-[#00aa59]/10 text-[#00aa59] text-sm font-semibold px-3 py-1 rounded-full">₹{plan.monthlyPrice}/mo</span>}
                  {plan.pricingType === "yearly" && <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">₹{plan.yearlyPrice}/yr</span>}
                  {plan.pricingType === "both" && (
                    <div className="flex flex-col gap-1">
                      <span className="bg-[#00aa59]/10 text-[#00aa59] text-sm font-semibold px-3 py-1 rounded-full">₹{plan.monthlyPrice}/mo</span>
                      <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">₹{plan.yearlyPrice}/yr</span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {plan.popular && <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-2 py-0.5 rounded-full border border-blue-200">Popular</span>}
                    {plan.recommended && <span className="bg-green-50 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full border border-green-200">Best Value</span>}
                    {!plan.popular && !plan.recommended && <span className="text-gray-400">—</span>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {Array.isArray(plan.features) && plan.features.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {plan.features.map((feat, fi) => (
                        <span key={fi} className="bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full border border-gray-200 whitespace-nowrap">✓ {feat}</span>
                      ))}
                    </div>
                  ) : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${plan.status === "inactive" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-[#00aa59] border-green-200"}`}>
                    {plan.status === "inactive" ? "Inactive" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setViewPlan(plan)} className="flex items-center gap-1 bg-[#00aa59] hover:bg-[#008f4a] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"><MdVisibility /> View</button>
                    <button onClick={() => { setEditEntry(plan); setPlanModal(true); }} className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"><MdEdit /> Edit</button>
                    <button onClick={() => handleDelete(plan._id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"><MdDelete /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {planModal && <PlanModal entry={editEntry} onSave={handleSave} onClose={() => { setPlanModal(false); setEditEntry(null); }} />}

      {viewPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#00aa59] px-8 py-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><MdVisibility /> Plan Details</h2>
              <button onClick={() => setViewPlan(null)} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition"><MdClose className="text-xl" /></button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#00aa59]/10 flex items-center justify-center mx-auto mb-3">
                  <MdCreditCard className="text-3xl text-[#00aa59]" />
                </div>
                <p className="font-bold text-gray-800 text-xl">{viewPlan.name}</p>
                {viewPlan.tagline && <p className="text-base text-gray-500 mt-1">{viewPlan.tagline}</p>}
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {viewPlan.popular && <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">Popular</span>}
                  {viewPlan.recommended && <span className="bg-green-50 text-[#00aa59] text-sm font-semibold px-3 py-1 rounded-full border border-green-200">Best Value</span>}
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${viewPlan.status === "inactive" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-[#00aa59] border-green-200"}`}>
                    {viewPlan.status === "inactive" ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {viewPlan.monthlyPrice !== "" && viewPlan.monthlyPrice !== undefined && (
                  <div className="bg-[#00aa59]/5 rounded-xl p-4 border border-green-100 text-center">
                    <p className="text-sm font-bold text-[#00aa59] uppercase tracking-wide mb-1">Monthly</p>
                    <p className="text-2xl font-bold text-gray-800">₹{viewPlan.monthlyPrice}</p>
                  </div>
                )}
                {viewPlan.yearlyPrice !== "" && viewPlan.yearlyPrice !== undefined && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">Yearly</p>
                    <p className="text-2xl font-bold text-gray-800">₹{viewPlan.yearlyPrice}</p>
                  </div>
                )}
              </div>
              {Array.isArray(viewPlan.features) && viewPlan.features.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Features</p>
                  <div className="flex flex-col gap-2">
                    {viewPlan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <MdCheckCircle className="text-[#00aa59] text-base shrink-0" />
                        <span className="text-base text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewPlan(null)} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
