import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Edit2, Trash2, Plus, Shield, Upload } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/admin`;

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return alert("Category name is required");

    const formData = new FormData();
    formData.append('name', newCategory);
    if (newDesc) formData.append('description', newDesc);
    if (newImage) formData.append('image', newImage);

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Category Added Successfully!");
        resetAddForm();
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to add category");
    }
  };

  const saveEdit = async (id) => {
    const formData = new FormData();
    formData.append('name', document.getElementById(`catName-${id}`).value);
    if (document.getElementById(`desc-${id}`)) {
      formData.append('description', document.getElementById(`desc-${id}`).value);
    }
    // Image edit can be added later if needed

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Updated Successfully!");
        setEditing(null);
        fetchCategories();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const deleteCategory = async (id, name, isDefault) => {
    if (isDefault) return alert("Default categories cannot be deleted!");
    if (!window.confirm(`Delete "${name}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Deleted Successfully");
        fetchCategories();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const resetAddForm = () => {
    setNewCategory('');
    setNewDesc('');
    setNewImage(null);
    setPreviewImage(null);
    setShowAddForm(false);
  };

  if (loading) return <Layout><div className="text-center py-20">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Categories</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl">
          <Plus size={20} /> Add New Category
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-8 mb-8 shadow">
          <h3 className="font-semibold mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category Name" className="border rounded-2xl px-5 py-4" />
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" className="border rounded-2xl px-5 py-4" />
            
            <div className="md:col-span-2">
              <label className="block mb-2">Category Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewImage && <img src={previewImage} alt="preview" className="mt-4 h-32 object-cover rounded-xl" />}
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button onClick={addCategory} className="bg-green-600 text-white px-8 py-3 rounded-2xl">Add Category</button>
            <button onClick={resetAddForm} className="border px-8 py-3 rounded-2xl">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6">Image</th>
              <th className="text-left p-6">Category Name</th>
              <th className="text-left p-6">Type</th>
              <th className="w-48 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id || cat.name} className="border-t hover:bg-gray-50">
                <td className="p-6">
                  <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-xl" />
                </td>
                <td className="p-6 font-medium">
                  {editing?._id === cat._id ? (
                    <input id={`catName-${cat._id}`} defaultValue={cat.name} className="w-full border rounded-xl px-4 py-3" />
                  ) : cat.name}
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1 rounded-full text-xs ${cat.isDefault ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {cat.isDefault ? 'Default' : 'Custom'}
                  </span>
                </td>
                <td className="p-6 text-center">
                  {editing?._id === cat._id ? (
                    <div className="flex gap-4 justify-center">
                      <button onClick={() => saveEdit(cat._id)} className="text-green-600">Save</button>
                      <button onClick={() => setEditing(null)} className="text-gray-500">Cancel</button>
                    </div>
                  ) : (
                    !cat.isDefault && (
                      <div className="flex gap-4 justify-center">
                        <button onClick={() => setEditing(cat)} className="text-blue-600"><Edit2 size={20} /></button>
                        <button onClick={() => deleteCategory(cat._id, cat.name, cat.isDefault)} className="text-red-600"><Trash2 size={20} /></button>
                      </div>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Categories;