import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

const DEFAULT_CATEGORIES = [
  'medicine', 'cosmetics', 'personal-care', 'food', 'beverages',
  'confectionery', 'daily-use', 'home-kitchen', 'construction',
  'machinery', 'electrical', 'apparel', 'textiles', 'electronics',
  'automotive', 'agriculture', 'packaging', 'pet-supplies'
];

const toTitle = (value = "") =>
  value
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const normalizeSubcategories = (subcategories) => {
  if (!Array.isArray(subcategories)) return [];
  return subcategories
    .map((item) => {
      if (typeof item === 'string') return { name: item, referenceImage: '' };
      return {
        name: String(item?.name || '').trim().toLowerCase(),
        referenceImage: String(item?.referenceImage || '').trim(),
      };
    })
    .filter((item) => item.name);
};

export default function SellerDashboard() {
  const { user, isLoaded, isSignedIn, isProfileComplete, getToken, refreshProfile } = useAppAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: "",
    email: "",
    mobile: "",
    address: "",
    website: "",
  });

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    otherCategory: "",
    otherSubcategory: "",
    price: "",
    moq: 100,
    description: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [requestedCategoryImage, setRequestedCategoryImage] = useState(null);
  const [requestedCategoryPreview, setRequestedCategoryPreview] = useState(null);
  const [requestedSubcategoryImage, setRequestedSubcategoryImage] = useState(null);
  const [requestedSubcategoryPreview, setRequestedSubcategoryPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const selectedCategoryData = useMemo(() => {
    return allCategories.find((cat) => cat.name === form.category) || null;
  }, [allCategories, form.category]);

  const subcategoryOptions = useMemo(() => {
    if (!selectedCategoryData) return [];
    return normalizeSubcategories(selectedCategoryData.subcategories);
  }, [selectedCategoryData]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchAllCategories();
      fetchMyProducts();
      fetchMyEnquiries();
      fetchBusinessProfile();
      fetchMyRequests();
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (isLoaded && isSignedIn && !isProfileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="text-6xl mb-6">!</div>
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

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-gray-50">Loading...</div>;
  }

  if (!isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-gray-50">Redirecting...</div>;
  }

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      if (res.data.success) {
        const incoming = Array.isArray(res.data.categories) ? res.data.categories : [];

        const map = new Map();
        for (const item of incoming) {
          const name = String(item?.name || '').trim().toLowerCase();
          if (!name) continue;
          map.set(name, {
            name,
            subcategories: normalizeSubcategories(item?.subcategories),
          });
        }

        for (const name of DEFAULT_CATEGORIES) {
          if (!map.has(name)) {
            map.set(name, { name, subcategories: [] });
          }
        }

        const sorted = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(sorted);
      }
    } catch (err) {
      const fallback = DEFAULT_CATEGORIES.map((name) => ({ name, subcategories: [] }));
      setAllCategories(fallback);
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



  const fetchMyRequests = async () => {
  try {
    const token = await getToken();
    const res = await axios.get(`${API_BASE_URL}/requests/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Do something with the data
    // For example:
    // setMyRequests(res.data.requests || []);
    
    console.log("My Requests:", res.data);
  } catch (err) {
    console.error("Error fetching my requests:", err);
    // Optionally show a toast/notification
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

  const fetchBusinessProfile = async () => {
    try {
      setProfileLoading(true);
      const token = await getToken();
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data?.user || {};
      setProfileForm({
        businessName: profile.company || user?.unsafeMetadata?.businessName || "",
        email: profile.email || user?.primaryEmailAddress?.emailAddress || user?.unsafeMetadata?.email || "",
        mobile: profile.phone || user?.unsafeMetadata?.mobile || "",
        address: profile.address || user?.unsafeMetadata?.address || "",
        website: profile.website || user?.unsafeMetadata?.website || "",
      });
    } catch (err) {
      console.error("Error fetching business profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileForm.businessName || !profileForm.email || !profileForm.mobile || !profileForm.address) {
      alert("Business name, email, mobile and address are required");
      return;
    }

    try {
      setProfileSubmitting(true);
      const token = await getToken();
      await axios.post(
        `${API_BASE_URL}/auth/complete-profile`,
        {
          businessName: profileForm.businessName,
          email: profileForm.email,
          mobile: profileForm.mobile,
          address: profileForm.address,
          website: profileForm.website,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await refreshProfile(token);
      await fetchBusinessProfile();
      alert("Business profile updated successfully");
      navigate("/seller-dashboard", { replace: true });
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.response?.data?.message || "Failed to update business profile");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const updateEnquiryStatus = async (enquiryId, status) => {
    try {
      setStatusUpdatingId(enquiryId);
      const token = await getToken();
      const res = await axios.patch(
        `${API_BASE_URL}/enquiries/my/${enquiryId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnquiries((prev) =>
        prev.map((enq) =>
          enq._id === enquiryId
            ? { ...enq, ...res.data.enquiry }
            : enq
        )
      );
    } catch (err) {
      console.error("Error updating enquiry status:", err);
      alert(err.response?.data?.error || "Failed to update enquiry status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "contacted":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "closed":
        return "bg-slate-200 text-slate-700";
      case "replied":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Maximum 4 images allowed per product");
      return;
    }
    setSelectedImages(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      subcategory: value === 'other' ? 'other' : '',
      otherCategory: '',
      otherSubcategory: '',
    }));
    if (value !== 'other') {
      setRequestedCategoryImage(null);
    }
    setRequestedSubcategoryImage(null);
  };

  const handleSubcategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      subcategory: value,
      otherSubcategory: value === 'other' ? prev.otherSubcategory : '',
    }));
    if (value !== 'other') {
      setRequestedSubcategoryImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.subcategory || !form.price) {
      alert("Product Name, Category, Subcategory and Price are required");
      return;
    }

    if (form.category === 'other' && !form.otherCategory.trim()) {
      alert('Please enter your custom category name');
      return;
    }

    if (form.subcategory === 'other' && !form.otherSubcategory.trim()) {
      alert('Please enter your custom subcategory name');
      return;
    }

    // Images are optional for category requests
    // if (form.category === 'other' && !requestedCategoryImage && !editingId) {
    //   alert('New category request ke liye category image upload karna zaroori hai');
    //   return;
    // }

    // if (form.category === 'other' && !requestedSubcategoryImage && !editingId) {
    //   alert('New category request ke liye subcategory image upload karna zaroori hai');
    //   return;
    // }

    setSubmitting(true);
    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("category", form.category.toLowerCase().trim());
      formData.append("subcategory", (form.subcategory || '').toLowerCase().trim());
      formData.append("otherCategory", form.otherCategory || '');
      formData.append("otherSubcategory", form.otherSubcategory || '');
      formData.append("price", form.price);
      formData.append("moq", form.moq || 100);
      formData.append("description", form.description || "");

      selectedImages.forEach(image => formData.append("images", image));
      if (requestedCategoryImage) {
        formData.append("requestedCategoryImage", requestedCategoryImage);
      }
      if (requestedSubcategoryImage) {
        formData.append("requestedSubcategoryImage", requestedSubcategoryImage);
      }

      if (editingId) {
        await axios.put(`${API_BASE_URL}/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert(editingId ? "Product Updated!" : "Product Added Successfully!");
      resetForm();
      fetchMyProducts();
    } catch (error) {
      console.error("Add/Update Product Error:", error);
      alert(error.response?.data?.message || error.response?.data?.error || "Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      subcategory: "",
      otherCategory: "",
      otherSubcategory: "",
      price: "",
      moq: 100,
      description: "",
    });
    setSelectedImages([]);
    setPreviewUrls([]);
    setRequestedCategoryImage(null);
    setRequestedCategoryPreview(null);
    setRequestedSubcategoryImage(null);
    setRequestedSubcategoryPreview(null);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      otherCategory: product.requestedCategoryName || '',
      otherSubcategory: product.requestedSubcategoryName || '',
      price: product.price,
      moq: product.moq || 100,
      description: product.description || "",
    });
    setEditingId(product._id);
    setPreviewUrls(product.images || []);
    setRequestedCategoryImage(null);
    setRequestedCategoryPreview(null);
    setRequestedSubcategoryImage(null);
    setRequestedSubcategoryPreview(null);
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
              Welcome back, {user?.firstName || user?.unsafeMetadata?.businessName || "User"}
            </p>
          </div>
          <button
            onClick={() => setActiveTab("profile")}
            className="bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-700 px-6 py-3 rounded-2xl font-semibold transition-all"
          >
            Edit Business Profile
          </button>
        </div>

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
            className={`flex-1 py-5 text-lg font-semibold transition-all ${
              activeTab === "enquiries" ? "border-b-4 border-emerald-600 text-emerald-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-5 text-lg font-semibold rounded-tr-3xl transition-all ${
              activeTab === "profile" ? "border-b-4 border-emerald-600 text-emerald-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Business Profile
          </button>
        </div>

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
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                  className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="">Select Category *</option>
                  {allCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{toTitle(cat.name)}</option>
                  ))}
                  <option value="other">Other (Not Listed)</option>
                </select>

                {form.category === 'other' && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Enter Custom Category Name *"
                      value={form.otherCategory}
                      onChange={(e) => setForm({ ...form, otherCategory: e.target.value })}
                      required
                      className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Enter Custom Subcategory Name *"
                      value={form.otherSubcategory}
                      onChange={(e) => setForm({ ...form, otherSubcategory: e.target.value })}
                      required
                      className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {form.category && form.category !== 'other' && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select
                      value={form.subcategory}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="">Select Subcategory *</option>
                      {subcategoryOptions.map((sub) => (
                        <option key={sub.name} value={sub.name}>{toTitle(sub.name)}</option>
                      ))}
                      <option value="other">Other (Not Listed)</option>
                    </select>

                    {form.subcategory === 'other' ? (
                      <input
                        type="text"
                        placeholder="Enter Custom Subcategory Name *"
                        value={form.otherSubcategory}
                        onChange={(e) => setForm({ ...form, otherSubcategory: e.target.value })}
                        required
                        className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center rounded-2xl border border-gray-200 px-4 text-sm text-gray-500">
                        Subcategory required hai. Agar list me missing ho to Other select karke request bhejiye.
                      </div>
                    )}
                  </div>
                )}

                {(form.category === 'other' || form.subcategory === 'other') && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.category === 'other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Category Reference Image (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setRequestedCategoryImage(file);
                            setRequestedCategoryPreview(file ? URL.createObjectURL(file) : null);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {requestedCategoryPreview && (
                          <img src={requestedCategoryPreview} alt="Category preview" className="mt-3 h-24 w-24 object-cover rounded-lg border" />
                        )}
                      </div>
                    )}

                    {form.subcategory === 'other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Subcategory Reference Image (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setRequestedSubcategoryImage(file);
                            setRequestedSubcategoryPreview(file ? URL.createObjectURL(file) : null);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {requestedSubcategoryPreview && (
                          <img src={requestedSubcategoryPreview} alt="Subcategory preview" className="mt-3 h-24 w-24 object-cover rounded-lg border" />
                        )}
                      </div>
                    )}

                    <div className="md:col-span-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                      {form.category === 'other'
                        ? 'New category request super admin ke paas jayegi aur approval ke baad category add hogi. Images optional hai.'
                        : 'Missing subcategory request super admin ke paas jayegi. Final subcategory image super admin approve karega.'}
                    </div>
                  </div>
                )}

                <input
                  type="number"
                  placeholder="Price (Rs) *"
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
                      Rs {p.price?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MOQ: {p.moq || "N/A"} • Category: {p.category}
                      {p.subcategory ? ` / ${p.subcategory}` : ''}
                    </p>
                    {p.taxonomyStatus === 'pending' && (
                      <p className="text-xs mt-2 text-amber-700 bg-amber-50 inline-block px-2 py-1 rounded-lg">
                        Pending taxonomy approval
                      </p>
                    )}
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
                          Rs {enq.productId?.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className={`px-5 py-1.5 rounded-full text-sm font-medium ${getStatusClasses(enq.status)}`}>
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
                        {enq.buyerPhone && (
                          <div>
                            <span className="text-gray-500 block">Phone</span>
                            <span className="font-semibold">{enq.buyerPhone}</span>
                          </div>
                        )}
                        {enq.buyerCompany && (
                          <div className={enq.buyerPhone ? "md:col-span-2" : "md:col-span-1"}>
                            <span className="text-gray-500 block">Company</span>
                            <span className="font-semibold">{enq.buyerCompany}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateEnquiryStatus(enq._id, "contacted")}
                        disabled={statusUpdatingId === enq._id || enq.status === "contacted"}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-medium transition"
                      >
                        {statusUpdatingId === enq._id && enq.status !== "contacted" ? "Updating..." : "Mark Contacted"}
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enq._id, "rejected")}
                        disabled={statusUpdatingId === enq._id || enq.status === "rejected"}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium transition"
                      >
                        {statusUpdatingId === enq._id && enq.status !== "rejected" ? "Updating..." : "Mark Rejected"}
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enq._id, "pending")}
                        disabled={statusUpdatingId === enq._id || enq.status === "pending"}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-medium transition"
                      >
                        {statusUpdatingId === enq._id && enq.status !== "pending" ? "Updating..." : "Set Pending"}
                      </button>
                    </div>

                    {enq.message && (
                      <div className="mt-6 p-6 bg-white border-l-4 border-emerald-500 rounded-2xl text-gray-700 italic">
                        "{enq.message}"
                      </div>
                    )}

                    {enq.enquiryType === "contact_click" && (
                      <div className="mt-4 text-sm bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
                        Buyer clicked your{" "}
                        <span className="font-semibold capitalize">{enq.contactMethod || "contact detail"}</span>
                        {enq.contactValue ? (
                          <>
                            {" "}({enq.contactValue})
                          </>
                        ) : null}
                        {" "}from explore page.
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-6">
                      Received: {new Date(enq.createdAt).toLocaleString('en-IN')}
                    </p>
                    {enq.sellerStatusUpdatedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Seller status updated: {new Date(enq.sellerStatusUpdatedAt).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-semibold">
                Business Summary
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">
                {profileForm.businessName || user?.unsafeMetadata?.businessName || "Your Business"}
              </h2>
              <p className="text-gray-600 mt-3">
                Yahin se aap apna business name, mail id, phone number, address aur website update kar sakte ho.
              </p>

              <div className="mt-8 space-y-5">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{profileForm.businessName || "-"}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">Email ID</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 break-all">{profileForm.email || "-"}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{profileForm.mobile || "-"}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 whitespace-pre-line">{profileForm.address || "-"}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 break-all">{profileForm.website || "-"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-2">Edit Business Profile</h2>
              <p className="text-gray-600 mb-8">
                Jo details buyers aur admins dekhte hain, unko yahan se update kar lo.
              </p>

              {profileLoading ? (
                <div className="text-gray-500">Loading profile...</div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      value={profileForm.businessName}
                      onChange={handleProfileInputChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileInputChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={profileForm.mobile}
                      onChange={handleProfileInputChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      rows="4"
                      value={profileForm.address}
                      onChange={handleProfileInputChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 resize-y"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      placeholder="https://example.com"
                      value={profileForm.website}
                      onChange={handleProfileInputChange}
                      className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
                  >
                    {profileSubmitting ? "Saving Profile..." : "Save Business Profile"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
