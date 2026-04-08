// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, Factory } from 'lucide-react';
import { 
  FaPills, FaGem, FaBaby, FaUtensils, FaGlassCheers, 
  FaCandyCane, FaShoppingBasket, FaHardHat, FaTshirt, 
  FaMicrochip, FaCar, FaTools, FaLeaf, FaPaw 
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : "http://localhost:5000/api";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultCategories = [
    { name: 'Medicine & Pharmaceuticals', desc: 'APIs, formulations, medical devices', icon: <FaPills className="text-red-600" />, slug: 'medicine', count: 184, popular: true },
    { name: 'Cosmetics & Beauty', desc: 'Skincare, makeup, haircare', icon: <FaGem className="text-pink-500" />, slug: 'cosmetics', count: 142 },
    { name: 'Personal Care', desc: 'Toiletries, hygiene products', icon: <FaBaby className="text-cyan-600" />, slug: 'personal-care', count: 98 },
    { name: 'Food & Agro Products', desc: 'Grains, spices, oils', icon: <FaUtensils className="text-green-600" />, slug: 'food', count: 378, popular: true },
    { name: 'Beverages', desc: 'Juices, tea, coffee', icon: <FaGlassCheers className="text-blue-500" />, slug: 'beverages', count: 112 },
    { name: 'Confectionery & Snacks', desc: 'Chocolates, biscuits', icon: <FaCandyCane className="text-purple-500" />, slug: 'confectionery', count: 89 },
    { name: 'Daily Use & FMCG', desc: 'Detergents, cleaning', icon: <FaShoppingBasket className="text-amber-600" />, slug: 'daily-use', count: 245 },
    { name: 'Home & Kitchen', desc: 'Utensils, appliances', icon: <Factory className="text-orange-600" size={28} />, slug: 'home-kitchen', count: 167 },
    { name: 'Construction Materials', desc: 'Cement, steel, pipes', icon: <FaHardHat className="text-yellow-700" />, slug: 'construction', count: 203, popular: true },
    { name: 'Industrial Machinery', desc: 'Pumps, motors, generators', icon: <FaTools className="text-gray-700" />, slug: 'machinery', count: 156 },
    { name: 'Electrical & Electronics', desc: 'Cables, switches, LEDs', icon: <Factory className="text-blue-700" size={28} />, slug: 'electrical', count: 134 },
    { name: 'Apparel & Garments', desc: 'Clothing, uniforms', icon: <FaTshirt className="text-indigo-600" />, slug: 'apparel', count: 198 },
    { name: 'Textiles & Fabrics', desc: 'Yarn, cotton, polyester', icon: <Factory className="text-pink-600" size={28} />, slug: 'textiles', count: 176 },
    { name: 'Electronics & Components', desc: 'PCBs, semiconductors', icon: <FaMicrochip className="text-cyan-700" />, slug: 'electronics', count: 145 },
    { name: 'Automotive & Spare Parts', desc: 'Tyres, batteries', icon: <FaCar className="text-red-700" />, slug: 'automotive', count: 132 },
    { name: 'Agriculture & Organic', desc: 'Seeds, fertilizers', icon: <FaLeaf className="text-green-700" />, slug: 'agriculture', count: 119 },
    { name: 'Packaging Materials', desc: 'Boxes, bottles, pouches', icon: <Factory className="text-amber-700" size={28} />, slug: 'packaging', count: 108 },
    { name: 'Pet Supplies', desc: 'Pet food, grooming', icon: <FaPaw className="text-amber-600" />, slug: 'pet-supplies', count: 74 },
  ];

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);   // ← Public Route

      if (res.data.success) {
        const backendNames = res.data.categories.map(c => c.name);

        const combined = [...defaultCategories];

        backendNames.forEach(name => {
          if (!combined.some(cat => cat.slug === name)) {
            combined.push({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              desc: "Premium products available",
              slug: name,
              icon: <Factory size={28} className="text-slate-600" />,
              count: 0,
              popular: false,
            });
          }
        });

        setCategories(combined);
      }
    } catch (err) {
      console.warn("Using only default categories");
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryClick = (slug) => {
    document.getElementById(`category-${slug}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    setActiveCategory(slug);
  };

  if (loading) {
    return <aside className="w-full h-screen flex items-center justify-center bg-slate-50">Loading categories...</aside>;
  }

  return (
    <aside className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white border-r border-slate-200">
      {/* Header + Search - Same as before */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Factory className="text-white" size={24} />
          </div>
          <h2 className="font-bold text-xl">Categories</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCategories.map((cat) => (
          <motion.div
            key={cat.slug}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <div className={`cursor-pointer rounded-xl p-4 flex gap-4 border transition-all ${
              activeCategory === cat.slug ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
            }`}>
              <div className="text-3xl w-14 h-14 flex items-center justify-center bg-white rounded-lg shadow-sm">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{cat.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}