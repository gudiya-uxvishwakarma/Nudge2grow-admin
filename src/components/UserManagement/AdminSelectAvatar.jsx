import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdAccountCircle } from "react-icons/md";
import { api } from "../../api";

const Modal = ({ entry, onSave, onClose, saving }) => {
  const [form, setForm] = useState(entry ? { ...entry } : { image: "" });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 400;
      let { width, height } = img;
      if (width > height) {
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
      } else {
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      setForm(p => ({ ...p, image: canvas.toDataURL("image/jpeg", 0.7) }));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-[#45a578] px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {entry ? <><MdEdit /> Edit Avatar</> : <><MdAdd /> Add Avatar</>}
          </h2>
          <button onClick={onClose}><MdClose className="text-white text-2xl" /></button>
        </div>

        <div className="px-8 py-6">
          <label className="flex flex-col items-center gap-4 cursor-pointer group">
            <div className={`w-36 h-36 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition
              ${form.image ? "border-[#45a578]" : "border-gray-300 group-hover:border-[#45a578]"}`}>
              {form.image ? (
                <img src={form.image} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <MdAccountCircle className="text-gray-300 text-6xl group-hover:text-[#45a578] transition" />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-500 group-hover:text-[#45a578] transition">
              {form.image ? "Change Image" : "Select Image"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {form.image && (
            <button type="button" onClick={() => setForm(p => ({ ...p, image: "" }))}
              className="mt-3 w-full text-sm text-red-400 hover:text-red-600 font-semibold text-center">
              Remove
            </button>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 text-base border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={() => form.image && onSave(form)} disabled={!form.image || saving}
            className={`px-8 py-3 rounded-xl text-white text-base font-bold flex items-center gap-2 transition ${form.image && !saving ? "bg-[#45a578] hover:bg-[#3a9068]" : "bg-gray-300 cursor-not-allowed"}`}>
            <MdSave /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminSelectAvatar = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAvatar, setEditAvatar] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.avatars.getAll();
      setAvatars(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editAvatar) await api.avatars.update(editAvatar._id, form);
      else await api.avatars.create(form);
      setModalOpen(false);
      setEditAvatar(null);
      await load();
    } catch (e) { console.error(e); alert("Save failed."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this avatar?")) return;
    try { await api.avatars.remove(id); await load(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#45a578] flex items-center justify-center shadow-lg shrink-0">
            <MdAccountCircle className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold text-gray-800">Select Avatar</h1>
            <p className="text-gray-500 text-base mt-1">Manage avatars available for children</p>
          </div>
        </div>
        <button onClick={() => { setEditAvatar(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#45a578] text-white px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#3a9068] transition">
          <MdAdd className="text-2xl" /> Add Avatar
        </button>
      </div>

      {/* Grid */}
      {avatars.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <MdAccountCircle className="text-7xl text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium">No avatars yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {avatars.map(av => (
            <div key={av._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <img src={av.image} className="w-full h-44 object-cover rounded-xl mb-3" alt={av.name} />
              <div className="flex gap-2">
                <button onClick={() => { setEditAvatar(av); setModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold transition">
                  <MdEdit /> Edit
                </button>
                <button onClick={() => handleDelete(av._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition">
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal entry={editAvatar} onSave={handleSave} onClose={() => { setModalOpen(false); setEditAvatar(null); }} saving={saving} />
      )}
    </div>
  );
};

export default AdminSelectAvatar;
