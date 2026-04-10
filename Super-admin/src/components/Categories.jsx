import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Edit2, Trash2, Plus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/admin';

const getImageUrl = (url) => url && url.startsWith('http') ? url : `http://localhost:5000${url || ''}`;

const emptySub = () => ({ name: '', referenceImage: '', file: null, preview: '', removeImage: false });

function normalizeSubcategories(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => {
    if (typeof item === 'string') return { name: item, referenceImage: '' };
    return {
      name: String(item?.name || '').trim().toLowerCase(),
      referenceImage: String(item?.referenceImage || '').trim(),
    };
  }).filter((item) => item.name);
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [clearNewImage, setClearNewImage] = useState(false);
  const [newSubcategories, setNewSubcategories] = useState([emptySub()]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [clearEditImage, setClearEditImage] = useState(false);
  const [editSubcategories, setEditSubcategories] = useState([emptySub()]);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const rows = (data.categories || []).map((cat) => ({
          ...cat,
          subcategories: normalizeSubcategories(cat.subcategories),
        }));
        setCategories(rows);
      }
    } catch (err) {
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const makeCategoryFormData = ({ name, description, imageFile, clearImage, subcategories }) => {
    const formData = new FormData();
    formData.append('name', name.trim().toLowerCase());
    if (description) formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);
    if (clearImage) formData.append('clearImage', 'true');

    const normalized = subcategories
      .map((sub) => ({
        name: String(sub.name || '').trim().toLowerCase(),
        referenceImage: String(sub.referenceImage || '').trim(),
      }))
      .filter((sub) => sub.name);

    formData.append('subcategories', JSON.stringify(normalized));
    formData.append(
      'clearSubcategoryImages',
      JSON.stringify(
        subcategories
          .filter((sub) => sub.removeImage)
          .map((sub) => String(sub.name || '').trim().toLowerCase())
          .filter(Boolean)
      )
    );

    normalized.forEach((_, idx) => {
      const file = subcategories[idx]?.file;
      if (file) {
        formData.append(`subcategoryImage_${idx}`, file);
      }
    });

    return formData;
  };

  const handleImageChange = (setterFile, setterPreview) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setterFile(file);
    setterPreview(URL.createObjectURL(file));
  };

  const updateSubAt = (list, setList, idx, patch) => {
    const next = [...list];
    next[idx] = { ...next[idx], ...patch };
    setList(next);
  };

  const addSubRow = (list, setList) => setList([...list, emptySub()]);
  const removeSubRow = (list, setList, idx) => setList(list.filter((_, i) => i !== idx));

  const addCategory = async () => {
    if (!newCategory.trim()) return alert('Category name is required');

    const formData = makeCategoryFormData({
      name: newCategory,
      description: newDesc,
      imageFile: newImage,
      clearImage: clearNewImage,
      subcategories: newSubcategories,
    });

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Category saved successfully');
        resetAddForm();
        fetchCategories();
      } else {
        alert(data.message || 'Failed to save category');
      }
    } catch {
      alert('Failed to add category');
    }
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setEditName(cat.name || '');
    setEditDesc(cat.description || '');
    setEditImage(null);
    setEditImagePreview(null);
    setClearEditImage(false);
    setEditSubcategories(
      (cat.subcategories?.length ? cat.subcategories : [emptySub()]).map((sub) => ({
        name: sub.name,
        referenceImage: sub.referenceImage || '',
        file: null,
        preview: '',
        removeImage: false,
      }))
    );
  };

  const saveEdit = async () => {
    const formData = makeCategoryFormData({
      name: editName,
      description: editDesc,
      imageFile: editImage,
      clearImage: clearEditImage,
      subcategories: editSubcategories,
    });

    try {
      const isExistingDoc = Boolean(editing?._id);
      const endpoint = isExistingDoc ? `${API_BASE}/categories/${editing._id}` : `${API_BASE}/categories`;
      const method = isExistingDoc ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Updated successfully');
        setEditing(null);
        fetchCategories();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch {
      alert('Update failed');
    }
  };

  const deleteCategory = async (id, name, isDefault) => {
    if (isDefault) return alert('Default categories cannot be deleted!');
    if (!window.confirm(`Delete "${name}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert('Deleted successfully');
        fetchCategories();
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch {
      alert('Delete failed');
    }
  };

  const resetAddForm = () => {
    setNewCategory('');
    setNewDesc('');
    setNewImage(null);
    setPreviewImage(null);
    setClearNewImage(false);
    setNewSubcategories([emptySub()]);
    setShowAddForm(false);
  };

  if (loading) return <Layout><div className="text-center py-20">Loading...</div></Layout>;

  const renderSubRows = (list, setList, editable = true) => (
    <div className="space-y-3">
      {list.map((sub, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <input
            type="text"
            placeholder="Subcategory Name"
            value={sub.name}
            disabled={!editable}
            onChange={(e) => updateSubAt(list, setList, idx, { name: e.target.value })}
            className="border rounded-xl px-4 py-3"
          />

          <div>
            <input
              type="file"
              disabled={!editable}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                updateSubAt(list, setList, idx, {
                  file,
                  preview: URL.createObjectURL(file),
                  removeImage: false,
                });
              }}
            />
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP only</p>
          </div>

          <div className="flex items-center gap-2">
            {(sub.preview || sub.referenceImage) ? (
              <img src={sub.preview || getImageUrl(sub.referenceImage)} alt="ref" className="h-12 w-12 object-cover rounded-lg border" />
            ) : (
              <span className="text-xs text-gray-500">No image</span>
            )}
            {editable && (sub.preview || sub.referenceImage) && (
              <button
                type="button"
                onClick={() => updateSubAt(list, setList, idx, {
                  file: null,
                  preview: '',
                  referenceImage: '',
                  removeImage: true,
                })}
                className="text-red-600 text-sm"
              >
                Remove image
              </button>
            )}
            {editable && list.length > 1 && (
              <button type="button" onClick={() => removeSubRow(list, setList, idx)} className="text-red-600 text-sm">Remove</button>
            )}
          </div>
        </div>
      ))}
      {editable && (
        <button type="button" onClick={() => addSubRow(list, setList)} className="text-blue-600 text-sm">
          + Add Subcategory
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Categories</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl">
          <Plus size={20} /> Add New Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-3xl p-8 mb-8 shadow">
          <h3 className="font-semibold mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category Name" className="border rounded-2xl px-5 py-4" />
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" className="border rounded-2xl px-5 py-4" />

            <div className="md:col-span-2">
                <label className="block mb-2">Category Image</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                setClearNewImage(false);
                handleImageChange(setNewImage, setPreviewImage)(e);
              }} />
              <p className="text-sm text-gray-500 mt-1">Accepted formats: JPEG, PNG, WebP</p>
              {(previewImage || (!clearNewImage && newImage)) && <img src={previewImage} alt="preview" className="mt-4 h-32 object-cover rounded-xl" />}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Subcategories + Reference Images</label>
              {renderSubRows(newSubcategories, setNewSubcategories, true)}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button onClick={addCategory} className="bg-green-600 text-white px-8 py-3 rounded-2xl">Save Category</button>
            <button onClick={resetAddForm} className="border px-8 py-3 rounded-2xl">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6">Image</th>
              <th className="text-left p-6">Category Name</th>
              <th className="text-left p-6">Subcategories</th>
              <th className="text-left p-6">Type</th>
              <th className="w-48 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id || cat.name} className="border-t hover:bg-gray-50 align-top">
                <td className="p-6">
                  <img src={getImageUrl(cat.image) || 'https://picsum.photos/id/20/200/200'} alt={cat.name} className="w-16 h-16 object-cover rounded-xl" />
                </td>
                <td className="p-6 font-medium">{cat.name}</td>
                <td className="p-6">
                  <div className="space-y-1">
                    {(cat.subcategories || []).length === 0 && <div className="text-sm text-gray-500">No subcategories</div>}
                    {(cat.subcategories || []).map((sub) => (
                      <div key={sub.name} className="text-sm flex items-center gap-2">
                        <span>{sub.name}</span>
                        {sub.referenceImage && <a href={getImageUrl(sub.referenceImage)} target="_blank" rel="noreferrer" className="text-blue-600 underline">Image</a>}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1 rounded-full text-xs ${cat.isDefault ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {cat.isDefault ? 'Default' : 'Custom'}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => startEdit(cat)} className="text-blue-600"><Edit2 size={20} /></button>
                    {!cat.isDefault && (
                      <button onClick={() => deleteCategory(cat._id, cat.name, cat.isDefault)} className="text-red-600"><Trash2 size={20} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-bold mb-6">Edit Category</h3>

            <div className="space-y-5">
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border rounded-2xl px-5 py-4" placeholder="Category Name" />
              <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full border rounded-2xl px-5 py-4" placeholder="Description" />

              <div>
                <label className="block mb-2">Category Image</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                  setClearEditImage(false);
                  handleImageChange(setEditImage, setEditImagePreview)(e);
                }} />
                <p className="text-sm text-gray-500 mt-1">Accepted formats: JPEG, PNG, WebP</p>
                {(editImagePreview || (!clearEditImage && editing.image)) && (
                  <img src={editImagePreview || getImageUrl(editing.image)} alt="preview" className="mt-3 h-24 object-cover rounded-xl" />
                )}
                {(editImagePreview || editing.image) && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditImage(null);
                      setEditImagePreview(null);
                      setClearEditImage(true);
                    }}
                    className="mt-3 text-sm text-red-600"
                  >
                    Remove category image
                  </button>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium">Subcategories + Reference Images</label>
                {renderSubRows(editSubcategories, setEditSubcategories, true)}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 py-4 border rounded-2xl font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Categories;

