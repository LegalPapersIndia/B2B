import { useState, useEffect, useMemo } from 'react';
import Layout from './Layout';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/admin`
  : 'http://localhost:5000/api/admin';

const normalizeSubcategoryNames = (subcategories) => {
  if (!Array.isArray(subcategories)) return [];
  return subcategories
    .map((item) => (typeof item === 'string' ? item : item?.name))
    .map((name) => String(name || '').trim().toLowerCase())
    .filter(Boolean);
};

function Products() {
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    requestedCategoryName: '',
    requestedSubcategoryName: '',
    taxonomyStatus: 'confirmed',
    price: 0,
    moq: 1,
    description: '',
    imagesText: '',
  });

  const [resolving, setResolving] = useState(null);
  const [finalCategory, setFinalCategory] = useState('');
  const [finalSubcategory, setFinalSubcategory] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [subcategoryReferenceImage, setSubcategoryReferenceImage] = useState('');
  const [useRequestedCategoryImage, setUseRequestedCategoryImage] = useState(false);
  const [useRequestedSubcategoryImage, setUseRequestedSubcategoryImage] = useState(false);

  const token = localStorage.getItem('adminToken');

  const categoryNames = useMemo(() => {
    return [...new Set((categories || []).map((c) => String(c?.name || '').trim().toLowerCase()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const subcategoryOptionsForEdit = useMemo(() => {
    if (!editForm.category) return [];
    const selectedCategory = (categories || []).find((c) => String(c?.name || '').trim().toLowerCase() === editForm.category);
    const fromCategory = normalizeSubcategoryNames(selectedCategory?.subcategories || []);
    const merged = new Set(fromCategory);
    if (editForm.subcategory) merged.add(String(editForm.subcategory).trim().toLowerCase());
    return [...merged].sort((a, b) => a.localeCompare(b));
  }, [categories, editForm.category, editForm.subcategory]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProducts(), fetchPendingProducts(), fetchCategories()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data.products || []);
  };

  const fetchPendingProducts = async () => {
    const res = await fetch(`${API_BASE}/products/pending-taxonomy`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPendingProducts(data.products || []);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const openEditModal = (product) => {
    setEditing(product);
    setEditForm({
      name: product.name || '',
      category: String(product.category || '').trim().toLowerCase(),
      subcategory: String(product.subcategory || '').trim().toLowerCase(),
      requestedCategoryName: String(product.requestedCategoryName || '').trim().toLowerCase(),
      requestedSubcategoryName: String(product.requestedSubcategoryName || '').trim().toLowerCase(),
      taxonomyStatus: product.taxonomyStatus || 'confirmed',
      price: Number(product.price || 0),
      moq: Number(product.moq || 1),
      description: product.description || '',
      imagesText: (product.images || []).join('\n'),
    });
  };

  const saveEdit = async (id) => {
    const images = editForm.imagesText
      ? editForm.imagesText.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const updatedData = {
      name: editForm.name.trim(),
      category: String(editForm.category || '').trim().toLowerCase(),
      subcategory: String(editForm.subcategory || '').trim().toLowerCase(),
      requestedCategoryName: String(editForm.requestedCategoryName || '').trim().toLowerCase(),
      requestedSubcategoryName: String(editForm.requestedSubcategoryName || '').trim().toLowerCase(),
      taxonomyStatus: String(editForm.taxonomyStatus || 'confirmed').trim(),
      price: Number(editForm.price || 0),
      moq: Number(editForm.moq || 1),
      description: String(editForm.description || '').trim(),
      images,
    };

    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (!data.success) {
      alert(data.message || 'Update failed');
      return;
    }

    alert('Product Updated Successfully!');
    setEditing(null);
    fetchAll();
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;

    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!data.success) {
      alert(data.message || 'Delete failed');
      return;
    }

    alert('Product Deleted!');
    fetchAll();
  };

  const openResolveModal = (product) => {
    setResolving(product);
    setFinalCategory((product.category !== 'other' ? product.category : product.requestedCategoryName) || '');
    setFinalSubcategory((product.subcategory !== 'other' ? product.subcategory : product.requestedSubcategoryName) || '');
    setCategoryImage('');
    setSubcategoryReferenceImage('');
    setUseRequestedCategoryImage(Boolean(product.requestedCategoryImage));
    setUseRequestedSubcategoryImage(Boolean(product.requestedSubcategoryImage));
  };

  const resolveTaxonomy = async () => {
    if (!resolving?._id) return;
    if (!finalCategory.trim() || !finalSubcategory.trim()) {
      alert('Final category and final subcategory are required');
      return;
    }

    const res = await fetch(`${API_BASE}/products/${resolving._id}/resolve-taxonomy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        finalCategory: finalCategory.trim().toLowerCase(),
        finalSubcategory: finalSubcategory.trim().toLowerCase(),
        categoryImage: useRequestedCategoryImage
          ? String(resolving?.requestedCategoryImage || '').trim()
          : categoryImage.trim(),
        subcategoryReferenceImage: useRequestedSubcategoryImage
          ? String(resolving?.requestedSubcategoryImage || '').trim()
          : subcategoryReferenceImage.trim(),
        clearCategoryImage: !useRequestedCategoryImage && !categoryImage.trim(),
        clearSubcategoryReferenceImage: !useRequestedSubcategoryImage && !subcategoryReferenceImage.trim(),
      }),
    });

    const data = await res.json();
    if (!data.success) {
      alert(data.message || 'Failed to resolve taxonomy');
      return;
    }

    alert('Approved and synced successfully');
    setResolving(null);
    fetchAll();
  };

  const renderProductsTable = (rows, showResolveColumn = false) => (
    <div className="bg-white rounded-3xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-6">Product</th>
            <th className="text-left p-6">Seller</th>
            <th className="text-left p-6">Category</th>
            <th className="text-left p-6">Subcategory</th>
            <th className="text-left p-6">Taxonomy</th>
            {showResolveColumn && <th className="text-left p-6">Requested</th>}
            <th className="w-48 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p._id} className="border-t hover:bg-gray-50 align-top">
              <td className="p-6">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">Rs {p.price} • MOQ {p.moq}</div>
              </td>
              <td className="p-6">
                <div className="font-medium text-gray-800">{p.sellerName}</div>
                <div className="text-sm text-gray-600">{p.sellerCompany}</div>
              </td>
              <td className="p-6 text-gray-700">{p.category || '-'}</td>
              <td className="p-6 text-gray-700">{p.subcategory || '-'}</td>
              <td className="p-6 text-gray-700">{p.taxonomyStatus || 'confirmed'}</td>
              {showResolveColumn && (
                <td className="p-6 text-sm text-amber-700">
                  <div>Category: {p.requestedCategoryName || '-'}</div>
                  <div>Subcategory: {p.requestedSubcategoryName || '-'}</div>
                  {p.requestedCategoryImage && <div><a href={p.requestedCategoryImage} target="_blank" rel="noreferrer" className="text-blue-600 underline">Category image</a></div>}
                  {p.requestedSubcategoryImage && <div><a href={p.requestedSubcategoryImage} target="_blank" rel="noreferrer" className="text-blue-600 underline">Subcategory image</a></div>}
                </td>
              )}
              <td className="p-6 text-center">
                <div className="flex gap-2 justify-center">
                  {showResolveColumn && (
                    <button onClick={() => openResolveModal(p)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-xl" title="Approve/Resolve Taxonomy">
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button onClick={() => openEditModal(p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl" title="Edit Product">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => deleteProduct(p._id, p.name)} className="text-red-600 hover:bg-red-50 p-2 rounded-xl" title="Delete Product">
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <Layout><div className="text-center py-20 text-xl">Loading Products...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Product Control Panel</h1>
        <p className="text-gray-500">All: {products.length} • Pending approvals: {pendingProducts.length}</p>
      </div>

      <div className="mb-6 bg-white rounded-2xl p-2 inline-flex gap-2 shadow-sm border">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-xl ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          All Products
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2 rounded-xl ${activeTab === 'pending' ? 'bg-amber-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Pending Approvals ({pendingProducts.length})
        </button>
      </div>

      {activeTab === 'all' && renderProductsTable(products, false)}
      {activeTab === 'pending' && renderProductsTable(pendingProducts, true)}

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-bold mb-6">Edit Product</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Product Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-2xl px-5 py-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value, subcategory: '' }))}
                    className="w-full border rounded-2xl px-5 py-4 bg-white"
                  >
                    <option value="">Select category</option>
                    {categoryNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Subcategory</label>
                  {subcategoryOptionsForEdit.length > 0 ? (
                    <select
                      value={editForm.subcategory}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, subcategory: e.target.value }))}
                      className="w-full border rounded-2xl px-5 py-4 bg-white"
                    >
                      <option value="">Select subcategory</option>
                      {subcategoryOptionsForEdit.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={editForm.subcategory}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, subcategory: e.target.value }))}
                      placeholder="No subcategory list found, type manually"
                      className="w-full border rounded-2xl px-5 py-4"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Requested Category</label>
                  <input
                    value={editForm.requestedCategoryName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, requestedCategoryName: e.target.value }))}
                    className="w-full border rounded-2xl px-5 py-4"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Requested Subcategory</label>
                  <input
                    value={editForm.requestedSubcategoryName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, requestedSubcategoryName: e.target.value }))}
                    className="w-full border rounded-2xl px-5 py-4"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Taxonomy Status</label>
                  <select
                    value={editForm.taxonomyStatus}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, taxonomyStatus: e.target.value }))}
                    className="w-full border rounded-2xl px-5 py-4 bg-white"
                  >
                    <option value="confirmed">confirmed</option>
                    <option value="pending">pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full border rounded-2xl px-5 py-4"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">MOQ</label>
                  <input
                    type="number"
                    value={editForm.moq}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, moq: e.target.value }))}
                    className="w-full border rounded-2xl px-5 py-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded-2xl px-5 py-4 h-24"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Product Image URLs (one per line)</label>
                <textarea
                  value={editForm.imagesText}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, imagesText: e.target.value }))}
                  className="w-full border rounded-2xl px-5 py-4 h-28"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 py-4 border rounded-2xl font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveEdit(editing._id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {resolving && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Resolve Taxonomy Approval</h3>
            <p className="text-sm text-gray-500 mb-6">Super admin decision is final for category and subcategory.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Requested</label>
                <div className="text-sm bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700">
                  Category: {resolving.requestedCategoryName || resolving.category || '-'}<br />
                  Subcategory: {resolving.requestedSubcategoryName || resolving.subcategory || '-'}
                </div>
              </div>

              {(resolving.requestedCategoryImage || resolving.requestedSubcategoryImage) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-2xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Requested Category Image</p>
                    {resolving.requestedCategoryImage ? (
                      <>
                        <img src={resolving.requestedCategoryImage} alt="Requested category" className="w-full h-40 object-cover rounded-xl border" />
                        <label className="flex items-center gap-2 mt-3 text-sm">
                          <input
                            type="checkbox"
                            checked={useRequestedCategoryImage}
                            onChange={(e) => setUseRequestedCategoryImage(e.target.checked)}
                          />
                          Use seller submitted image
                        </label>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No category image submitted</p>
                    )}
                  </div>

                  <div className="border rounded-2xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Requested Subcategory Image</p>
                    {resolving.requestedSubcategoryImage ? (
                      <>
                        <img src={resolving.requestedSubcategoryImage} alt="Requested subcategory" className="w-full h-40 object-cover rounded-xl border" />
                        <label className="flex items-center gap-2 mt-3 text-sm">
                          <input
                            type="checkbox"
                            checked={useRequestedSubcategoryImage}
                            onChange={(e) => setUseRequestedSubcategoryImage(e.target.checked)}
                          />
                          Use seller submitted image
                        </label>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No subcategory image submitted</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-1">Final Category</label>
                <input
                  value={finalCategory}
                  onChange={(e) => setFinalCategory(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3"
                  placeholder="e.g. electronics"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Final Subcategory</label>
                <input
                  value={finalSubcategory}
                  onChange={(e) => setFinalSubcategory(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3"
                  placeholder="e.g. led-bulb"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Category Image URL (optional)</label>
                <input
                  value={categoryImage}
                  onChange={(e) => setCategoryImage(e.target.value)}
                  disabled={useRequestedCategoryImage}
                  className="w-full border rounded-2xl px-4 py-3 disabled:bg-gray-100"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Subcategory Reference Image URL (optional)</label>
                <input
                  value={subcategoryReferenceImage}
                  onChange={(e) => setSubcategoryReferenceImage(e.target.value)}
                  disabled={useRequestedSubcategoryImage}
                  className="w-full border rounded-2xl px-4 py-3 disabled:bg-gray-100"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setResolving(null)} className="flex-1 py-3 border rounded-2xl font-medium">Cancel</button>
              <button onClick={resolveTaxonomy} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium">
                Approve & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Products;
