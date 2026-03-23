import { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdPsychology } from "react-icons/md";
import { api } from "../../api";

const EMPTY = { question: "", answer: "", hint: "", isActive: true };

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { ...EMPTY });
  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const valid = form.question.trim() && form.answer.trim();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#7c3aed] px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MdPsychology /> {entry ? "Edit Riddle" : "Add Today's Riddle"}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Question <span className="text-red-500">*</span></label>
            <textarea rows={3} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 transition resize-none"
              placeholder="Enter the riddle question..." value={form.question} onChange={f("question")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Answer <span className="text-red-500">*</span></label>
            <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 transition"
              placeholder="Enter the answer..." value={form.answer} onChange={f("answer")} />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Hint (optional)</label>
            <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 transition"
              placeholder="Give a small hint..." value={form.hint} onChange={f("hint")} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 accent-[#7c3aed]" />
            <label htmlFor="isActive" className="text-base font-semibold text-gray-700">Active (show in app)</label>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-base font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid || saving}
            className={`px-8 py-2.5 rounded-xl text-white text-base font-bold transition shadow flex items-center gap-2 ${valid && !saving ? "bg-[#7c3aed] hover:bg-[#6d28d9]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : entry ? "Update" : "Add Riddle"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminTodaysRiddle = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.riddles.getAll();
      setItems(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editItem) await api.riddles.update(editItem._id, form);
      else await api.riddles.create(form);
      setModalOpen(false);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this riddle?")) return;
    try { await api.riddles.remove(id); await load(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shadow-md">
            <MdPsychology className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Today's Riddles</h1>
            <p className="text-gray-500 text-base mt-0.5">Manage riddles shown on the home screen</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#7c3aed] text-white px-6 py-4 rounded-xl font-bold text-base shadow hover:bg-[#6d28d9] transition">
          <MdAdd className="text-xl" /> Add Riddle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-400">
            <MdPsychology className="text-6xl text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No riddles yet. Add your first one!</p>
          </div>
        ) : items.map(item => (
          <div key={item._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-[#7c3aed]/30 transition">
            <div className="flex items-center justify-between mb-2">
              <MdPsychology className="text-[#7c3aed] text-xl" />
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-gray-800 text-base font-medium leading-snug mb-2">{item.question}</p>
            <div className="bg-[#7c3aed]/5 rounded-lg px-3 py-1.5 mb-1">
              <span className="text-sm font-semibold text-[#7c3aed]">Answer: </span>
              <span className="text-sm text-gray-700">{item.answer}</span>
            </div>
            {item.hint && <p className="text-sm text-gray-400 italic mb-2">Hint: {item.hint}</p>}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-500 text-white py-1.5 rounded-lg text-sm font-semibold transition">
                <MdEdit /> Edit
              </button>
              <button onClick={() => handleDelete(item._id)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm font-semibold transition">
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && <Modal entry={editItem} onSave={handleSave} onClose={() => setModalOpen(false)} saving={saving} />}
    </div>
  );
};

export default AdminTodaysRiddle;
