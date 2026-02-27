import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPills, FaUtensils, FaGem, FaGlassCheers, FaCandyCane,
  FaShoppingBasket, FaHardHat, FaTshirt, FaLaptop, FaCar,
  FaTools, FaMicrochip, FaLeaf, FaBaby, FaDog,
} from 'react-icons/fa';
import {
  Search, Filter, Building2, Zap, Package, Cpu,
  Hammer, Plug, Factory, Shirt, Baby, PawPrint,
} from 'lucide-react';

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');

  const categories = [
    // Health & Personal
    { name: 'Medicine & Pharmaceuticals', desc: 'APIs, formulations, medical devices, generics', icon: <FaPills className="text-red-600" />, slug: 'medicine', count: 184, popular: true },
    { name: 'Cosmetics & Beauty', desc: 'Skincare, makeup, haircare, perfumes', icon: <FaGem className="text-pink-500" />, slug: 'cosmetics', count: 142 },
    { name: 'Personal Care', desc: 'Toiletries, hygiene products, soaps', icon: <FaBaby className="text-cyan-600" />, slug: 'personal-care', count: 98 },

    // Food & Beverage
    { name: 'Food & Agro Products', desc: 'Grains, spices, oils, frozen food', icon: <FaUtensils className="text-green-600" />, slug: 'food', count: 378, popular: true },
    { name: 'Beverages', desc: 'Juices, energy drinks, tea, coffee', icon: <FaGlassCheers className="text-blue-500" />, slug: 'beverages', count: 112 },
    { name: 'Confectionery & Snacks', desc: 'Chocolates, biscuits, namkeen', icon: <FaCandyCane className="text-purple-500" />, slug: 'confectionery', count: 89 },

    // Daily Use & Household
    { name: 'Daily Use & FMCG', desc: 'Detergents, toilet paper, cleaning', icon: <FaShoppingBasket className="text-amber-600" />, slug: 'daily-use', count: 245 },
    { name: 'Home & Kitchen', desc: 'Utensils, appliances, decor', icon: <Building2 className="text-orange-600" size={28} />, slug: 'home-kitchen', count: 167 },

    // Industrial & Construction
    { name: 'Construction Materials', desc: 'Cement, steel, pipes, tiles', icon: <FaHardHat className="text-yellow-700" />, slug: 'construction', count: 203, popular: true },
    { name: 'Industrial Machinery', desc: 'Pumps, motors, generators', icon: <FaTools className="text-gray-700" />, slug: 'machinery', count: 156 },
    { name: 'Electrical & Electronics', desc: 'Cables, switches, LEDs', icon: <Plug className="text-blue-700" size={28} />, slug: 'electrical', count: 134 },

    // Fashion & Textiles
    { name: 'Apparel & Garments', desc: 'Clothing, uniforms, fashion wear', icon: <FaTshirt className="text-indigo-600" />, slug: 'apparel', count: 198 },
    { name: 'Textiles & Fabrics', desc: 'Yarn, cotton, polyester, home textiles', icon: <Shirt className="text-pink-600" size={28} />, slug: 'textiles', count: 176 },

    // Tech & Automotive
    { name: 'Electronics & Components', desc: 'Mobile parts, PCBs, semiconductors', icon: <FaMicrochip className="text-cyan-700" />, slug: 'electronics', count: 145 },
    { name: 'Automotive & Spare Parts', desc: 'Tyres, batteries, engine parts', icon: <FaCar className="text-red-700" />, slug: 'automotive', count: 132 },

    // Others (growing categories)
    { name: 'Agriculture & Organic', desc: 'Seeds, fertilizers, organic produce', icon: <FaLeaf className="text-green-700" />, slug: 'agriculture', count: 119 },
    { name: 'Packaging Materials', desc: 'Boxes, bottles, labels, pouches', icon: <Package className="text-amber-700" size={28} />, slug: 'packaging', count: 108 },
    { name: 'Pet Supplies', desc: 'Pet food, accessories, grooming', icon: <PawPrint className="text-amber-600" size={28} />, slug: 'pet-supplies', count: 74 },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug === activeCategory ? null : slug);
  };

  return (
    <aside className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm">

      {/* Header */}
      <div className="p-5 lg:p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
            <Filter className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Categories
            </h2>
            <p className="text-sm text-gray-600">
              Find products from 18+ industries
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all text-sm"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 scrollbar-hide">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No categories found matching "{search}"
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <motion.div
              key={cat.slug}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div
                onClick={() => handleCategoryClick(cat.slug)}
                className={`cursor-pointer rounded-xl transition-all duration-300 border p-4 flex items-start gap-4
                  ${activeCategory === cat.slug
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-sm'
                  }`}
              >
                <div className="text-3xl w-14 h-14 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 flex-shrink-0">
                  {cat.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-base truncate">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {cat.popular && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                          Popular
                        </span>
                      )}
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        {cat.count}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {cat.desc}
                  </p>

                  {activeCategory === cat.slug && (
                    <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                      <span className="text-base">✓</span> Active Filter
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-5 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-all mb-4 shadow-sm hover:shadow"
          >
            Clear Filter
          </button>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>Showing {filteredCategories.length} of {categories.length} categories</p>
          <p className="mt-1">Updated regularly • Verified suppliers only</p>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}