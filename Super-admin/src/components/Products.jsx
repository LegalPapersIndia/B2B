import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Edit2, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/admin` 
  : 'http://localhost:5000/api/admin';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (id) => {
    const updatedData = {
      name: document.getElementById('prodName').value.trim(),
      price: Number(document.getElementById('prodPrice').value),
      moq: Number(document.getElementById('prodMoq').value),
      description: document.getElementById('prodDesc').value.trim(),
    };

    await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    alert("Product Updated Successfully!");
    setEditing(null);
    fetchProducts();
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;

    await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Product Deleted!");
    fetchProducts();
  };

  if (loading) return <Layout><div className="text-center py-20 text-xl">Loading Products...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Products</h1>
        <p className="text-gray-500">Total: {products.length}</p>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6">Product Name</th>
              <th className="text-left p-6">Price</th>
              <th className="text-left p-6">MOQ</th>
              <th className="text-left p-6">Seller Name</th>
              <th className="text-left p-6">Company</th>
              <th className="w-40 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-6 font-medium">{p.name}</td>
                <td className="p-6">₹{p.price}</td>
                <td className="p-6">{p.moq}</td>
                <td className="p-6 font-medium text-gray-800">{p.sellerName}</td>
                <td className="p-6 text-gray-600">{p.sellerCompany}</td>
                <td className="p-6 text-center flex gap-3 justify-center">
                  <button onClick={() => setEditing(p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl">
                    <Edit2 size={22} />
                  </button>
                  <button onClick={() => deleteProduct(p._id, p.name)} className="text-red-600 hover:bg-red-50 p-2 rounded-xl">
                    <Trash2 size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-6">Edit Product</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Product Name</label>
                <input id="prodName" defaultValue={editing.name} className="w-full border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Price (₹)</label>
                  <input id="prodPrice" type="number" defaultValue={editing.price} className="w-full border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">MOQ</label>
                  <input id="prodMoq" type="number" defaultValue={editing.moq} className="w-full border rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Description</label>
                <textarea id="prodDesc" defaultValue={editing.description} className="w-full border rounded-2xl px-5 py-4 h-28 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setEditing(null)} 
                className="flex-1 py-4 border rounded-2xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveEdit(editing._id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Products;