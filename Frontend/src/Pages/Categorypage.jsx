import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const catRes = await axios.get(`${API_BASE_URL}/categories`);
      if (!catRes.data.success) throw new Error("Categories fetch failed");

      const allCats = catRes.data.categories || [];
      const found = allCats.find((c) => c.name === slug);

      if (!found) {
        setCategory(null);
        setLoading(false);
        return;
      }

      setCategory({
        slug: found.name,
        name: found.name.charAt(0).toUpperCase() + found.name.slice(1),
        desc: found.description || "High quality products available in bulk",
        image: found.image || "https://picsum.photos/id/20/600/400",
      });

      const prodRes = await axios.get(`${API_BASE_URL}/products?category=${slug}`);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
    } catch {
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreSubcategory = (product) => {
    if (!product?.subcategory) {
      alert("Subcategory not available for this product");
      return;
    }

    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    const isProfileComplete =
      user?.unsafeMetadata?.profileCompleted === true ||
      (user?.unsafeMetadata?.businessName && user?.unsafeMetadata?.mobile && user?.unsafeMetadata?.address);

    if (!isProfileComplete) {
      navigate("/complete-profile");
      return;
    }

    navigate(`/category/${encodeURIComponent(product.category)}/subcategory/${encodeURIComponent(product.subcategory)}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading category...</div>;
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Category Not Found</h2>
          <button onClick={() => navigate('/')} className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-xl">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-slate-600 hover:text-emerald-600">
          <ArrowLeft /> Back
        </button>

        <div className="relative h-[320px] rounded-3xl overflow-hidden mb-10">
          <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-5xl font-bold mb-3">{category.name}</h1>
            <p className="text-xl max-w-xl">{category.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <motion.div key={p._id} className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition">
              <img src={p.images?.[0] || "https://picsum.photos/id/20/600/400"} alt={p.name} className="w-full h-52 object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-2">{p.name}</h3>
                <p className="text-emerald-600 font-bold text-xl mt-1">Rs {p.price?.toLocaleString("en-IN")}</p>
                <p className="text-sm text-gray-500">MOQ: {p.moq}</p>
                <p className="text-xs text-slate-500 mt-1">Subcategory: {p.subcategory || "N/A"}</p>

                <button
                  onClick={() => handleExploreSubcategory(p)}
                  className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700"
                >
                  Explore Subcategory
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}