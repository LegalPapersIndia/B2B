// src/Pages/CategoryPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Star, MapPin, Layers, Clock, Filter, ChevronDown } from "lucide-react";
import axios from "axios";
import { useAppAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "moq-low", label: "MOQ: Low to High" },
];

const categoryImageFallbacks = {
  medicine: "https://www.biopharlifesciences.co.in/public/Blogs/1735552692jpg",
  cosmetics: "https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg",
  "personal-care": "https://cdn.shopify.com/s/files/1/0646/1551/4330/files/Importance_of_Personal_Care_Products_480x480.webp?v=1673811372",
  food: "https://static.vecteezy.com/system/resources/thumbnails/036/215/572/small/ai-generated-healthy-eating-wholegrain-cereal-plant-organic-food-vegetarian-meal-generated-by-ai-photo.jpg",
  beverages: "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2026-03/beverages1.jpg",
  confectionery: "https://cdn.prod.website-files.com/63cf34956bc59159af577c42/64237ff9b0a52d91ed0e8466_confectionery%20feature%20image.jpg",
  "daily-use": "https://images.financialexpressdigital.com/2025/09/diya-0001-2025-08-11T154519.556_20250902085553_20250912090708.jpg",
  "home-kitchen": "https://sonigaracorp.com/images/blog/Home-Kitchen/Prioritise_Storage_Space.jpg",
  construction: "https://d2d4xyu1zrrrws.cloudfront.net/website/web-ui/assets/images/temp/supply-chain-banner_msite.png",
  machinery: "https://www.techniwaterjet.com/wp-content/uploads/2024/01/1.jpg",
  electrical: "https://www.redlinegroup.com/app/data/blog/9c680883eff061d4999c1db10afcde5f.jpg",
  apparel: "https://media.licdn.com/dms/image/v2/D5612AQEDHdzGbCofEg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1701235776902?e=2147483647&v=beta&t=1lfEXXz0oXwZlhstZCAkMXN1c-FDSpxLpSHTki9lGqE",
  textiles: "https://cdn.shopify.com/s/files/1/0070/5023/1919/files/towel-g89d3b7292_1920_480x480.jpg?v=1650304781",
  electronics: "https://5.imimg.com/data5/SELLER/Default/2023/12/368947394/SS/LC/GV/183411497/electronic-components-and-semiconductor-devices.png",
  automotive: "https://images.jdmagicbox.com/quickquotes/images_main/-4ot4dcda.png",
  agriculture: "https://kids.earth.org/wp-content/uploads/2022/04/Untitled-1024-%C3%97-768px-17.jpg",
  packaging: "https://healeypackaging.co.uk/wp-content/uploads/2025/07/Types_of-Packaging-Materials-1-scaled.webp",
  "pet-supplies": "https://s32519.pcdn.co/wp-content/uploads/2023/03/pet-supply-retail-feature-image-1136x480.png",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isProfileComplete } = useAppAuth();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Sort products based on selection
  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    const result = [...products];
    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return result.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "moq-low":
        return result.sort((a, b) => (a.moq || 0) - (b.moq || 0));
      case "newest":
      default:
        return result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  }, [products, sortBy]);

  // Get subcategory counts
  const subcategoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const sub = p.subcategory || "other";
      counts[sub] = (counts[sub] || 0) + 1;
    });
    return counts;
  }, [products]);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const catRes = await axios.get(`${API_BASE_URL}/categories`);
      if (!catRes.data.success) throw new Error("Categories fetch failed");

      const allCats = catRes.data.categories || [];
      const found = allCats.find((c) => c.name?.toLowerCase() === slug?.toLowerCase());

      if (!found) {
        setCategory(null);
        setLoading(false);
        return;
      }

      setCategory({
        slug: found.name,
        name: found.name.charAt(0).toUpperCase() + found.name.slice(1),
        desc: found.description || "High quality products available in bulk",
        image: found.image 
          ? (found.image.startsWith('http') ? found.image : `${API_BASE_URL.replace('/api', '')}${found.image}`) 
          : (categoryImageFallbacks[found.name?.toLowerCase()] || "https://picsum.photos/id/20/600/400"),
        subcategories: (found.subcategories || []).map((sub) => ({
          name: sub.name,
          referenceImage: sub.referenceImage || '',
        })),
      });

      const prodRes = await axios.get(`${API_BASE_URL}/products?category=${slug}`);
      let fetchedProducts = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.products || [];

      // Premium seller logic
      fetchedProducts = fetchedProducts.map((product) => ({
        ...product,
        isPremiumSeller: product.seller?.isPremium === true
      }));

      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching category data:", err);
      setCategory(null);
      setProducts([]);
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

    if (!isProfileComplete) {
      navigate("/complete-profile");
      return;
    }

    navigate(`/category/${encodeURIComponent(product.category)}/subcategory/${encodeURIComponent(product.subcategory)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-orange-600 text-white px-8 py-3 rounded-2xl hover:bg-orange-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Categories
        </button>

        {/* Hero Banner */}
        <div className="relative h-[340px] rounded-3xl overflow-hidden mb-12 shadow-xl">
          <img 
            src={category.image} 
            alt={category.name} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          
          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-5xl font-bold mb-3 tracking-tight">{category.name}</h1>
            <p className="text-xl max-w-xl text-white/90">{category.desc}</p>
          </div>
        </div>

        {/* Subcategory Filter Badges */}
        {Object.keys(subcategoryCounts).length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-medium">
              <Layers className="w-4 h-4" />
              All Subcategories ({products.length})
            </span>
            {Object.entries(subcategoryCounts).map(([sub, count]) => (
              <button
                key={sub}
                onClick={() => handleExploreSubcategory(products.find(p => p.subcategory === sub) || { category: slug, subcategory: sub })}
                className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-orange-400 hover:text-orange-600 transition-all"
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{products.length}</span> products found
          </p>
          
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-400 transition-all"
            >
              <Filter className="w-4 h-4" />
              {sortOptions.find(o => o.value === sortBy)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition-all ${
                      sortBy === option.value ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((p) => (
              <motion.div 
                key={p._id} 
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 relative group"
              >
                {/* Premium Badge */}
                {p.isPremiumSeller && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                      <Star className="w-4 h-4 fill-current" />
                      PREMIUM SELLER
                    </div>
                  </div>
                )}

                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={p.images?.[0] || "https://picsum.photos/id/20/600/400"} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Multiple thumbnails preview */}
                  {p.images?.length > 1 && (
                    <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.images.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${p.name} ${idx + 1}`}
                          className="w-10 h-10 rounded-lg object-cover border-2 border-white"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 mb-2">
                    {p.name}
                  </h3>

                  {/* Description Preview */}
                  {p.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {p.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{p.price?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-500">
                      MOQ: <span className="font-medium">{p.moq || "N/A"}</span>
                    </p>
                  </div>

                  {p.subcategory && (
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3">
                      {p.subcategory.charAt(0).toUpperCase() + p.subcategory.slice(1)}
                    </span>
                  )}

                  {p.seller && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {p.seller.avatar ? (
                          <img
                            src={p.seller.avatar}
                            alt={p.seller.company}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {p.seller.company}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {p.seller.businessType && (
                              <span className="truncate">{p.seller.businessType}</span>
                            )}
                            {p.seller.city && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {p.seller.city}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleExploreSubcategory(p)}
                    className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-2xl font-medium transition-all active:scale-95"
                  >
                    Explore Subcategory
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No products found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
