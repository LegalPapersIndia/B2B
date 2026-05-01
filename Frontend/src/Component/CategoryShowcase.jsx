// src/components/CategoryShowcase.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowRight, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppAuth } from "../context/AuthContext";
import { defaultCategories, mergeCategories, getCategoryIcon } from "./categoriesConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

const getImageUrl = (url) => {
  if (!url) return "https://picsum.photos/id/20/600/400";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL.replace("/api", "")}${url}`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryShowcase() {
  const { isSignedIn, isProfileComplete } = useAppAuth();
  const navigate = useNavigate();

const [allCategories, setAllCategories] = useState(defaultCategories);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch Categories
  const fetchAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      if (res.data.success) {
        // Merge API categories with default categories (no duplicates)
        const merged = mergeCategories(res.data.categories || [], defaultCategories);
        setAllCategories(merged.length ? merged : defaultCategories);
      }
    } catch (err) {
      console.warn("Failed to fetch categories, using default:", err);
      setAllCategories(defaultCategories);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Fetch Products for all categories
  const fetchAllCategoryProducts = useCallback(async () => {
    if (!allCategories.length) return;

    setLoadingProducts(true);
    try {
      const promises = allCategories.map(async (category) => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/products?category=${encodeURIComponent(category.slug)}&homePreview=true`
          );
          return { slug: category.slug, products: res.data?.products || res.data || [] };
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
    } catch (err) {
      console.error("Error fetching products:", err);
      setCategoryProducts({});
    } finally {
      setLoadingProducts(false);
    }
  }, [allCategories]);

  useEffect(() => {
    fetchAllCategoryProducts();
  }, [fetchAllCategoryProducts]);

  const handleExploreSubcategory = (product) => {
    if (!product?.subcategory) {
      alert("Subcategory not available for this product");
      return;
    }
    if (!isSignedIn) return navigate("/login");
    if (!isProfileComplete) return navigate("/complete-profile");

    navigate(
      `/category/${encodeURIComponent(product.category)}/subcategory/${encodeURIComponent(product.subcategory)}`
    );
  };

  const handleViewAll = (slug) => navigate(`/category/${slug}`);

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-slate-200 rounded w-4/5" />
        <div className="h-4 bg-slate-200 rounded w-3/5" />
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-2">
          <TrendingUp className="w-4 h-4" /> Global Wholesale Marketplace
        </div>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Industrial Categories</h2>
        <p className="mt-2 text-slate-600">Source directly from verified manufacturers and suppliers.</p>
      </div>

      <div className="space-y-16">
        <AnimatePresence>
          {allCategories.map((category) => {
            const products = categoryProducts[category.slug] || [];
            const isLoading = loadingProducts || loadingCategories;

            return (
<motion.section
                id={`category-${category.slug}`}
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="scroll-mt-16"
              >
                {/* Category Header */}
                <div className="relative h-[260px] md:h-[300px] rounded-2xl overflow-hidden shadow-md mb-8 group">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                    <div className="max-w-lg">
                      <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full mb-3">
                        {products.length} Subcategories
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-slate-200 text-sm md:text-base line-clamp-2 mb-4">
                        {category.desc}
                      </p>
                      <button
                        onClick={() => handleViewAll(category.slug)}
                        className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold 
                                   hover:bg-orange-600 hover:text-white transition-all active:scale-95"
                      >
                        Explore Category <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategory Cards */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                  ) : products.length > 0 ? (
                    products.slice(0, 5).map((product, i) => {
                      const categoryData = allCategories.find((c) => c.slug === product.category);
                      const subcatData = categoryData?.subcategories?.find(
                        (s) => s.name === product.subcategory
                      );
                      const subcatImage = subcatData?.referenceImage
                        ? getImageUrl(subcatData.referenceImage)
                        : "";
                      const displayImage = subcatImage || product.images?.[0] || "https://picsum.photos/id/20/600/400";

                      return (
                        <motion.div
                          key={`${category.slug}-${i}`}
                          variants={cardVariants}
                          className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all relative overflow-hidden"
                        >
                          {/* Image */}
                          <div className="relative aspect-square overflow-hidden bg-slate-100">
                            <img
                              src={displayImage}
                              alt={product.subcategory || "Product"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h5 className="font-semibold text-lg line-clamp-2 mb-3 text-slate-800">
                              {product.subcategory
                                ? product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)
                                : "Uncategorized"}
                            </h5>

                            {product.seller?.company && (
                              <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                                {product.seller.avatar ? (
                                  <img
                                    src={product.seller.avatar}
                                    alt={product.seller.company}
                                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                  </div>
                                )}
                                <span className="truncate">{product.seller.company}</span>
                              </div>
                            )}

                            <button
                              onClick={() => handleExploreSubcategory(product)}
                              className="mt-2 w-full py-3 bg-orange-600 hover:bg-orange-700 
                                         text-white rounded-xl text-sm font-medium transition-all 
                                         flex items-center justify-center gap-2 active:scale-95"
                            >
                              Explore Subcategory
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-12 text-slate-500">
                      No products available in this category yet.
                    </div>
                  )}
                </motion.div>
              </motion.section>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}