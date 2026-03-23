import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdQuestionAnswer } from "react-icons/md";
import { api } from "../../../api";

const EMPTY = { question: "", answer: "" };

const inp = "w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base font-medium focus:outline-none focus:border-[#45a578] transition";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const valid = form.question.trim() !== "" && form.answer.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-[#45a578] px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit FAQ</> : <><MdAdd /> Add FAQ</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
        </div>

        <div className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Question *</label>
            <input className={inp} placeholder="e.g. What is Nudge2Grow?" value={form.question} onChange={f("question")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Answer *</label>
            <textarea className={`${inp} resize-none`} rows={5} placeholder="Write the answer here..." value={form.answer} onChange={f("answer")} />
          </div>
        </div>

        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-3 rounded-xl text-white text-base font-bold flex items-center gap-2 transition ${valid && !saving ? "bg-[#45a578] hover:bg-[#3a9068]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminFAQ = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.faqs.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.faqs.update(editItem._id, form);
      else await api.faqs.create(form);
      setModalOpen(false);
      setEditItem(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try { await api.faqs.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#45a578] flex items-center justify-center shadow-lg shrink-0">
            <MdQuestionAnswer className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Frequently Asked Questions</h1>
            <p className="text-gray-500 text-base mt-1">Manage FAQ questions and answers</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#3a9068] transition">
          <MdAdd className="text-2xl" /> Add FAQ
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-[#45a578] text-white">
            <tr>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left w-12">No</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Question</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-left">Answer</th>
              <th className="px-8 py-5 text-base font-bold uppercase tracking-wider text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-20 text-gray-400">
                <MdQuestionAnswer className="text-6xl text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No FAQs added yet.</p>
              </td></tr>
            ) : items.map((item, i) => (
              <tr key={item._id} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-green-50/30 transition-colors`}>
                <td className="px-8 py-5 text-base text-gray-500">{i + 1}</td>
                <td className="px-8 py-5 text-base font-semibold text-gray-800 max-w-xs">{item.question}</td>
                <td className="px-8 py-5 text-base text-gray-600 max-w-sm">
                  <p className="line-clamp-2">{item.answer}</p>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                      <MdDelete /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal entry={editItem} onSave={handleSave} onClose={() => { setModalOpen(false); setEditItem(null); }} saving={saving} />
      )}
    </div>
  );
};

export default AdminFAQ;
