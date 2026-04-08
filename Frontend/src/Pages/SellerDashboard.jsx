// src/Pages/SellerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useUser, useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

const DEFAULT_CATEGORIES = [
  'medicine', 'cosmetics', 'personal-care', 'food', 'beverages',
  'confectionery', 'daily-use', 'home-kitchen', 'construction',
  'machinery', 'electrical', 'apparel', 'textiles', 'electronics',
  'automotive', 'agriculture', 'packaging', 'pet-supplies'
];

export default function SellerDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [allCategories, setAllCategories] = useState(DEFAULT_CATEGORIES);

  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    moq: 100,
    description: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ================= PROFILE COMPLETE CHECK =================
  const isProfileComplete = user?.unsafeMetadata?.profileCompleted === true ||
                           (user?.company && user?.phone && user?.address);

  // Agar profile incomplete hai to warning screen dikhao
  if (isLoaded && isSignedIn && !isProfileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Profile Incomplete</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Aapka business profile complete nahi hai.<br />
            Products add karne ke liye pehle apna profile complete kar lijiye.
          </p>
          
          <button 
            onClick={() => navigate('/complete-profile')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all"
          >
            Complete Profile Now
          </button>

          <p className="text-sm text-gray-500 mt-6">
            Business Name, Mobile Number aur Address bharna zaroori hai
          </p>
        </div>
      </div>
    );
  }

  // Normal loading check
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-gray-50">Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // ================= DATA FETCHING =================
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchAllCategories();
      fetchMyProducts();
      fetchMyEnquiries();
    }
  }, [isLoaded, isSignedIn]);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      if (res.data.success) {
        let cats = res.data.categories || [];
        const normalized = cats.map(cat => typeof cat === 'string' ? cat : cat.name || cat);
        const combined = [...DEFAULT_CATEGORIES];
        normalized.forEach(cat => {
          if (cat && !combined.includes(cat)) combined.push(cat);
        });
        setAllCategories(combined);
      }
    } catch (err) {
      console.warn("Using default categories");
      setAllCategories(DEFAULT_CATEGORIES);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_BASE_URL}/products/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnquiries = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_BASE_URL}/enquiries/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(res.data);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    }
  };

  // ================= FORM HANDLERS =================
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Maximum 4 images allowed per product");
      return;
    }
    setSelectedImages(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      alert("Product Name, Category and Price are required");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("category", form.category.toLowerCase().trim());
      formData.append("price", form.price);
      formData.append("moq", form.moq || 100);
      formData.append("description", form.description || "");

      selectedImages.forEach(image => formData.append("images", image));

      let res;
      if (editingId) {
        res = await axios.put(`${API_BASE_URL}/products/${editingId}`, {
          name: form.name,
          category: form.category.toLowerCase().trim(),
          price: Number(form.price),
          moq: Number(form.moq),
          description: form.description,
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        res = await axios.post(`${API_BASE_URL}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert(editingId ? "Product Updated!" : "Product Added Successfully!");
      resetForm();
      fetchMyProducts();
    } catch (error) {
      console.error("Add/Update Product Error:", error);
      alert(error.response?.data?.message || "Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", category: "", price: "", moq: 100, description: "" });
    setSelectedImages([]);
    setPreviewUrls([]);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      moq: product.moq || 100,
      description: product.description || "",
    });
    setEditingId(product._id);
    setPreviewUrls(product.images || []);
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = await getToken();
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product Deleted Successfully");
      fetchMyProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.firstName || user?.company || "User"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-8 bg-white rounded-t-3xl shadow-sm">
          <button 
            onClick={() => setActiveTab("products")} 
            className={`flex-1 py-5 text-lg font-semibold rounded-tl-3xl transition-all ${
              activeTab === "products" ? "border-b-4 border-emerald-600 text-emerald-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Products ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab("enquiries")} 
            className={`flex-1 py-5 text-lg font-semibold rounded-tr-3xl transition-all ${
              activeTab === "enquiries" ? "border-b-4 border-emerald-600 text-emerald-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Product Name *" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                  className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500" 
                />

                <select 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  required 
                  className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="">Select Category *</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <input 
                  type="number" 
                  placeholder="Price (₹) *" 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  required 
                  className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500" 
                />

                <input 
                  type="number" 
                  placeholder="Minimum Order Quantity (MOQ)" 
                  value={form.moq} 
                  onChange={(e) => setForm({ ...form, moq: e.target.value })} 
                  className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500" 
                />

                <textarea 
                  placeholder="Product Description (Optional)" 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  className="md:col-span-2 px-5 py-4 border border-gray-300 rounded-2xl h-32 focus:outline-none focus:border-emerald-500" 
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (Max 4)
                  </label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageSelect} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                  />
                  {previewUrls.length > 0 && (
                    <div className="flex gap-3 mt-4 flex-wrap">
                      {previewUrls.map((url, i) => (
                        <img 
                          key={i} 
                          src={url} 
                          alt="preview" 
                          className="w-24 h-24 object-cover rounded-2xl border border-gray-200" 
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
                >
                  {submitting ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>

            {/* Products Grid */}
            <h2 className="text-3xl font-bold mb-8">My Products ({products.length})</h2>
            
            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading your products...</div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500">
                You haven't added any products yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                  <div key={p._id} className="bg-white rounded-3xl shadow hover:shadow-xl transition-all p-6">
                    {p.images?.[0] && (
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        className="w-full h-52 object-cover rounded-2xl mb-5" 
                      />
                    )}
                    <h3 className="font-semibold text-xl line-clamp-2">{p.name}</h3>
                    <p className="text-emerald-600 font-bold text-2xl mt-2">
                      ₹{p.price?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MOQ: {p.moq || "N/A"} • Category: {p.category}
                    </p>
                    <div className="flex gap-3 mt-8">
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-medium transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <div className="bg-white rounded-3xl shadow-xl">
            <div className="p-8 border-b">
              <h2 className="text-3xl font-bold">Received Enquiries</h2>
              <p className="text-gray-600 mt-1">
                All buyer inquiries on your products
              </p>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-20 text-center text-gray-500 text-lg">
                No enquiries received yet. Start adding products to get inquiries!
              </div>
            ) : (
              <div className="divide-y">
                {enquiries.map((enq) => (
                  <div key={enq._id} className="p-8 hover:bg-gray-50 transition">   
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xl">{enq.productId?.name}</h3>
                        <p className="text-emerald-600 font-medium">
                          ₹{enq.productId?.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="px-5 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {enq.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <p className="font-medium text-gray-700 mb-3">Buyer Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
                        <div>
                          <span className="text-gray-500 block">Name</span>
                          <span className="font-semibold">{enq.buyerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Email</span>
                          <span className="font-semibold text-blue-600">{enq.buyerEmail}</span>
                        </div>
                        {enq.buyerCompany && (
                          <div className="md:col-span-2">
                            <span className="text-gray-500 block">Company</span>
                            <span className="font-semibold">{enq.buyerCompany}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {enq.message && (
                      <div className="mt-6 p-6 bg-white border-l-4 border-emerald-500 rounded-2xl text-gray-700 italic">
                        "{enq.message}"
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-6">
                      Received: {new Date(enq.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}