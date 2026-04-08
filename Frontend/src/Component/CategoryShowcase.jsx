import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

export const categoriesData = [
  { slug: "medicine", name: "Medicine & Pharmaceuticals", desc: "APIs, generics and medical devices", image: "https://www.biopharlifesciences.co.in/public/Blogs/1735552692jpg" },
  { slug: "cosmetics", name: "Cosmetics & Beauty", desc: "Skincare, makeup & perfumes", image: "https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg" },
  { slug: "personal-care", name: "Personal Care", desc: "Daily hygiene & grooming products", image: "https://cdn.shopify.com/s/files/1/0646/1551/4330/files/Importance_of_Personal_Care_Products_480x480.webp?v=1673811372" },
  { slug: "food", name: "Food & Agro Products", desc: "Rice, spices, oils & pulses", image: "https://static.vecteezy.com/system/resources/thumbnails/036/215/572/small/ai-generated-healthy-eating-wholegrain-cereal-plant-organic-food-vegetarian-meal-generated-by-ai-photo.jpg" },
  { slug: "beverages", name: "Beverages", desc: "Tea, juices, energy drinks & coffee", image: "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2026-03/beverages1.jpg" },
  { slug: "confectionery", name: "Confectionery & Snacks", desc: "Chocolates, biscuits & namkeen", image: "https://cdn.prod.website-files.com/63cf34956bc59159af577c42/64237ff9b0a52d91ed0e8466_confectionery%20feature%20image.jpg" },
  { slug: "daily-use", name: "Daily Use & FMCG", desc: "Cleaning supplies & household essentials", image: "https://images.financialexpressdigital.com/2025/09/diya-0001-2025-08-11T154519.556_20250902085553_20250912090708.jpg" },
  { slug: "home-kitchen", name: "Home & Kitchen", desc: "Utensils, appliances & cookware", image: "https://sonigaracorp.com/images/blog/Home-Kitchen/Prioritise_Storage_Space.jpg" },
  { slug: "construction", name: "Construction Materials", desc: "Steel, cement, pipes & hardware", image: "https://d2d4xyu1zrrrws.cloudfront.net/website/web-ui/assets/images/temp/supply-chain-banner_msite.png" },
  { slug: "machinery", name: "Industrial Machinery", desc: "Pumps, generators & equipment", image: "https://www.techniwaterjet.com/wp-content/uploads/2024/01/1.jpg" },
  { slug: "electrical", name: "Electrical & Electronics", desc: "Cables, switches & lighting", image: "https://www.redlinegroup.com/app/data/blog/9c680883eff061d4999c1db10afcde5f.jpg" },
  { slug: "apparel", name: "Apparel & Garments", desc: "Clothing, uniforms & fashion wear", image: "https://media.licdn.com/dms/image/v2/D5612AQEDHdzGbCofEg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1701235776902?e=2147483647&v=beta&t=1lfEXXz0oXwZlhstZCAkMXN1c-FDSpxLpSHTki9lGqE" },
  { slug: "textiles", name: "Textiles & Fabrics", desc: "Yarn, cotton & polyester fabrics", image: "https://cdn.shopify.com/s/files/1/0070/5023/1919/files/towel-g89d3b7292_1920_480x480.jpg?v=1650304781" },
  { slug: "electronics", name: "Electronics & Components", desc: "Displays, PCBs & modules", image: "https://5.imimg.com/data5/SELLER/Default/2023/12/368947394/SS/LC/GV/183411497/electronic-components-and-semiconductor-devices.png" },
  { slug: "automotive", name: "Automotive Parts", desc: "Batteries, oils & spares", image: "https://images.jdmagicbox.com/quickquotes/images_main/-4ot4dcda.png" },
  { slug: "agriculture", name: "Agriculture & Organic", desc: "Seeds, fertilizers & farming tools", image: "https://kids.earth.org/wp-content/uploads/2022/04/Untitled-1024-%C3%97-768px-17.jpg" },
  { slug: "packaging", name: "Packaging Materials", desc: "Boxes, bottles & wrapping", image: "https://healeypackaging.co.uk/wp-content/uploads/2025/07/Types-of-Packaging-Materials-1-scaled.webp" },
  { slug: "pet-supplies", name: "Pet Supplies", desc: "Pet food, grooming & accessories", image: "https://s32519.pcdn.co/wp-content/uploads/2023/03/pet-supply-retail-feature-image-1136x480.png" },
];

export default function CategoryShowcase() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState(categoriesData);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      if (res.data.success) {
        const adminAdded = (res.data.categories || [])
          .filter((cat) => !categoriesData.some((def) => def.slug === cat.name))
          .map((cat) => ({
            slug: cat.name,
            name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
            desc: cat.description || "Premium quality products",
            image: cat.image || "https://picsum.photos/id/20/600/400",
          }));

        setAllCategories([...categoriesData, ...adminAdded]);
      }
    } catch {
      setAllCategories(categoriesData);
    }
  };

  useEffect(() => {
    fetchAllCategoryProducts();
  }, [allCategories]);

  const fetchAllCategoryProducts = async () => {
    setLoading(true);
    try {
      const promises = allCategories.map(async (category) => {
        try {
          const res = await axios.get(`${API_BASE_URL}/products?category=${category.slug}&homePreview=true`);
          return { slug: category.slug, products: res.data || [] };
        } catch {
          return { slug: category.slug, products: [] };
        }
      });

      const results = await Promise.all(promises);
      const productsMap = {};
      results.forEach(({ slug, products }) => {
        productsMap[slug] = products;
      });
      setCategoryProducts(productsMap);
    } catch {
      setCategoryProducts({});
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

  const handleViewAll = (slug) => navigate(`/category/${slug}`);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
          <TrendingUp className="w-4 h-4" /> Global Wholesale Marketplace
        </div>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Industrial Categories</h2>
        <p className="mt-2 text-slate-600">Source directly from verified manufacturers and suppliers.</p>
      </div>

      <div className="space-y-16">
        {allCategories.map((category) => {
          const products = categoryProducts[category.slug] || [];

          return (
            <motion.section
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-16"
            >
              <div className="relative h-[260px] md:h-[300px] rounded-2xl overflow-hidden shadow-md mb-8 group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                  <div className="max-w-lg">
                    <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full mb-3">
                      {products.length} Products
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-slate-200 text-sm md:text-base line-clamp-2 mb-4">{category.desc}</p>
                    <button
                      onClick={() => handleViewAll(category.slug)}
                      className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      Explore Category <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {loading
                  ? []
                  : products.slice(0, 5).map((product, i) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all"
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          <img
                            src={product.images?.[0] || "https://picsum.photos/id/20/600/400"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold line-clamp-2 mb-1">{product.name}</h5>
                          <p className="text-xs text-slate-500 mb-2">by {product.sellerCompany || "Unknown Supplier"}</p>
                          <p className="text-lg font-bold">Rs {product.price?.toLocaleString("en-IN")}</p>
                          <p className="text-xs text-slate-500 mt-1">Subcategory: {product.subcategory || "N/A"}</p>

                          <button
                            onClick={() => handleExploreSubcategory(product)}
                            className="mt-3 w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all"
                          >
                            Explore Subcategory
                          </button>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
