import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Star } from "lucide-react";
import axios from "axios";
import { useAppAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

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
        image: found.image 
          ? (found.image.startsWith('http') ? found.image : `${API_BASE_URL.replace('/api', '')}${found.image}`) 
          : (categoryImageFallbacks[found.name] || "https://picsum.photos/id/20/600/400"),
      });

      const prodRes = await axios.get(`${API_BASE_URL}/products?category=${slug}`);
      let fetchedProducts = Array.isArray(prodRes.data) ? prodRes.data : [];

      // 🔥 Important: Premium logic ko safe aur reliable banaya
      fetchedProducts = fetchedProducts.map((product) => {
        const seller = product.seller || {};
        
        return {
          ...product,
          // Agar seller.isPremium true hai toh premium maano
          isPremiumSeller: seller.isPremium === true
        };
      });

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
    return <div className="min-h-screen flex items-center justify-center">Loading category...</div>;
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Category Not Found</h2>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700"
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
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-emerald-600"
        >
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
            <motion.div 
              key={p._id} 
              className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition relative"
            >
              {/* Premium Badge - Yeh ab seller ke current status ke hisaab se dikhega */}
              {p.isPremiumSeller && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md">
                    <Star className="w-4 h-4 fill-current" />
                    PREMIUM SELLER
                  </div>
                </div>
              )}

              <img 
                src={p.images?.[0] || "https://picsum.photos/id/20/600/400"} 
                alt={p.name} 
                className="w-full h-52 object-cover" 
              />

              <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-2">{p.name}</h3>
                <p className="text-emerald-600 font-bold text-xl mt-1">
                  Rs {p.price?.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-500">MOQ: {p.moq}</p>
                <p className="text-xs text-slate-500 mt-1">Subcategory: {p.subcategory || "N/A"}</p>

                {p.seller?.company && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    {p.seller?.avatar ? (
                      <img
                        src={p.seller.avatar}
                        alt={p.seller.company}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span>
                      by <span className="font-medium">{p.seller.company}</span>
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleExploreSubcategory(p)}
                  className="mt-5 w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
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
