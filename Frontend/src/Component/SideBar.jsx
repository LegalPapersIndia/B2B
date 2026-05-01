// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, Factory } from 'lucide-react';
import { defaultCategories as sidebarDefaultCategories, mergeCategories, getCategoryIcon } from './categoriesConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : "http://localhost:5000/api";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prepare default categories for sidebar (with icons)
  const prepareSidebarCategories = () => {
    return sidebarDefaultCategories.map(cat => {
      const iconData = getCategoryIcon(cat.slug);
      const IconComponent = iconData.icon;
      return {
        ...cat,
        icon: <IconComponent className={iconData.color} size={28} />,
      };
    });
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);
  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);

      if (res.data.success) {
        // Get prepared defaults with icons
        const defaultsWithIcons = prepareSidebarCategories();
        
        // Merge API categories with default categories (no duplicates)
        const merged = mergeCategories(res.data.categories || [], defaultsWithIcons);
        
        // Add icons to merged categories
        const mergedWithIcons = merged.map(cat => {
          const iconData = getCategoryIcon(cat.slug);
          const IconComponent = iconData.icon;
          return {
            ...cat,
            icon: cat.icon || <IconComponent className={iconData.color} size={28} />,
          };
        });

        setCategories(mergedWithIcons);
      }
    } catch (err) {
      console.warn("Using default categories");
      setCategories(prepareSidebarCategories());
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.desc?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryClick = (slug) => {
    document.getElementById(`category-${slug}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    setActiveCategory(slug);
  };

  if (loading) {
    return (
      <aside className="w-full h-screen flex items-center justify-center bg-slate-50">
        Loading categories...
      </aside>
    );
  }

  return (
    <aside className="w-full h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Header + Search */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center">
            <Factory className="text-white" size={24} />
          </div>
          <h2 className="font-bold text-2xl text-gray-900">Categories</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filteredCategories.map((cat) => (
          <motion.div
            key={cat.slug}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(cat.slug)}
            className="cursor-pointer"
          >
            <div 
              className={`rounded-2xl p-4 flex gap-4 border transition-all duration-200 ${
                activeCategory === cat.slug 
                  ? 'border-orange-500 bg-orange-50 shadow-sm' 
                  : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
              }`}
            >
              {/* Icon Container */}
              <div className="text-3xl w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                {cat.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 leading-tight pr-2">
                    {cat.name}
                  </h3>
                  {cat.popular && (
                    <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      POPULAR
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {cat.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No categories found matching your search.
          </div>
        )}
      </div>
    </aside>
  );
}