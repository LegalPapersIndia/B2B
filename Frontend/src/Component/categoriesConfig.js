// Unified Category Configuration
// Single source of truth for category metadata
// Used by both CategoryShowcase and SideBar

import {
  FaPills, FaGem, FaBaby, FaUtensils, FaGlassCheers,
  FaCandyCane, FaShoppingBasket, FaHardHat, FaTshirt,
  FaMicrochip, FaCar, FaTools, FaLeaf, FaPaw,
  FaIndustry, FaFlask, FaBox, FaScroll,
  FaCogs, FaCircle, FaCookie, FaBoxOpen, FaWarehouse,
  FaCouch, FaAppleAlt, FaBeer, FaCoffee, FaSeedling,
  FaTree, FaCartPlus, FaSchool, FaPrint, FaTruck,
  FaBolt, FaSun, FaMusic, FaGamepad, FaFutbol,
  FaCog
} from 'react-icons/fa';

// Default icon for unknown categories
const DefaultIcon = FaBox;

// Category icons mapping with consistent colors
export const categoryIcons = {
  'medicine': { icon: FaPills, color: 'text-orange-600', bg: 'bg-orange-100' },
  'pharmaceuticals': { icon: FaFlask, color: 'text-orange-600', bg: 'bg-orange-100' },
  'cosmetics': { icon: FaGem, color: 'text-pink-600', bg: 'bg-pink-100' },
  'beauty': { icon: FaGem, color: 'text-pink-600', bg: 'bg-pink-100' },
  'personal-care': { icon: FaBaby, color: 'text-blue-600', bg: 'bg-blue-100' },
  'food': { icon: FaUtensils, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'agro-products': { icon: FaAppleAlt, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'beverages': { icon: FaGlassCheers, color: 'text-blue-600', bg: 'bg-blue-100' },
  'confectionery': { icon: FaCandyCane, color: 'text-purple-600', bg: 'bg-purple-100' },
  'snacks': { icon: FaCookie, color: 'text-amber-600', bg: 'bg-amber-100' },
  'daily-use': { icon: FaShoppingBasket, color: 'text-amber-600', bg: 'bg-amber-100' },
  'fmcg': { icon: FaCartPlus, color: 'text-amber-600', bg: 'bg-amber-100' },
  'home-kitchen': { icon: FaIndustry, color: 'text-orange-600', bg: 'bg-orange-100' },
  'construction': { icon: FaHardHat, color: 'text-amber-700', bg: 'bg-amber-100' },
  'machinery': { icon: FaTools, color: 'text-slate-700', bg: 'bg-slate-100' },
  'industrial-machinery': { icon: FaCogs, color: 'text-slate-700', bg: 'bg-slate-100' },
  'electrical': { icon: FaBolt, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'electronics': { icon: FaMicrochip, color: 'text-cyan-700', bg: 'bg-cyan-100' },
  'apparel': { icon: FaTshirt, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'garments': { icon: FaTshirt, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'textiles': { icon: FaWarehouse, color: 'text-pink-600', bg: 'bg-pink-100' },
  'fabrics': { icon: FaScroll, color: 'text-pink-600', bg: 'bg-pink-100' },
  'automotive': { icon: FaCar, color: 'text-red-700', bg: 'bg-red-100' },
  'spare-parts': { icon: FaCog, color: 'text-red-700', bg: 'bg-red-100' },
  'agriculture': { icon: FaLeaf, color: 'text-green-700', bg: 'bg-green-100' },
  'organic': { icon: FaSeedling, color: 'text-green-700', bg: 'bg-green-100' },
  'packaging': { icon: FaBoxOpen, color: 'text-amber-700', bg: 'bg-amber-100' },
  'pet-supplies': { icon: FaPaw, color: 'text-amber-600', bg: 'bg-amber-100' },
  'toys': { icon: FaGamepad, color: 'text-purple-600', bg: 'bg-purple-100' },
  'sports': { icon: FaFutbol, color: 'text-green-600', bg: 'bg-green-100' },
  'furniture': { icon: FaCouch, color: 'text-amber-800', bg: 'bg-amber-100' },
  'education': { icon: FaSchool, color: 'text-blue-600', bg: 'bg-blue-100' },
  'printing': { icon: FaPrint, color: 'text-slate-600', bg: 'bg-slate-100' },
  'logistics': { icon: FaTruck, color: 'text-blue-600', bg: 'bg-blue-100' },
  'chemicals': { icon: FaFlask, color: 'text-purple-600', bg: 'bg-purple-100' },
  'plastics': { icon: FaBox, color: 'text-blue-500', bg: 'bg-blue-100' },
  'metals': { icon: FaIndustry, color: 'text-slate-500', bg: 'bg-slate-100' },
  'rubber': { icon: FaCircle, color: 'text-slate-400', bg: 'bg-slate-100' },
};

const createCategory = (name, slug, desc, image, popular = false, count = 0) => ({
  name,
  slug: slug.toLowerCase().replace(/\s+/g, '-'),
  desc,
  image,
  popular,
  count,
  // Get icon based on slug
  getIcon: () => {
    const iconData = categoryIcons[slug.toLowerCase()] || categoryIcons['default'];
    const IconComponent = iconData?.icon || FaBox;
    return { IconComponent, color: iconData?.color || 'text-slate-600', bg: iconData?.bg || 'bg-slate-100' };
  }
});

// Default categories data - unified source for both components
export const defaultCategories = [
  createCategory(
    'Medicine & Pharmaceuticals',
    'medicine',
    'APIs, formulations, medical devices, generic medicines',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    true,
    184
  ),
  createCategory(
    'Cosmetics & Beauty',
    'cosmetics',
    'Skincare, makeup, haircare, fragrances, beauty products',
    'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800',
    true,
    142
  ),
  createCategory(
    'Personal Care',
    'personal-care',
    'Toiletries, hygiene products, baby care, adult care',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    false,
    98
  ),
  createCategory(
    'Food & Agro Products',
    'food',
    'Grains, spices, Oils, food ingredients, agricultural produce',
    'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800',
    true,
    378
  ),
  createCategory(
    'Beverages',
    'beverages',
    'Juices, tea, coffee, energy drinks, alcoholic beverages',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
    false,
    112
  ),
  createCategory(
    'Confectionery & Snacks',
    'confectionery',
    'Chocolates, biscuits, wafers, candy, instant snacks',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
    false,
    89
  ),
  createCategory(
    'Daily Use & FMCG',
    'daily-use',
    'Detergents, cleaning supplies, household essentials',
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    false,
    245
  ),
  createCategory(
    'Home & Kitchen',
    'home-kitchen',
    'Utensils, appliances, cookware, home decor, kitchenware',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    false,
    167
  ),
  createCategory(
    'Construction Materials',
    'construction',
    'Cement, steel, bricks, pipes, hardware, construction tools',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    true,
    203
  ),
  createCategory(
    'Industrial Machinery',
    'machinery',
    'Pumps, motors, generators, industrial equipment, CNC machines',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800',
    false,
    156
  ),
  createCategory(
    'Electrical & Electronics',
    'electrical',
    'Cables, switches, lighting, wiring accessories, electrical panels',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800',
    false,
    134
  ),
  createCategory(
    'Apparel & Garments',
    'apparel',
    'Clothing, uniforms, fashion wear, workwear, protective gear',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
    false,
    198
  ),
  createCategory(
    'Textiles & Fabrics',
    'textiles',
    'Yarn, cotton, polyester, synthetic fabrics, industrial textiles',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
    false,
    176
  ),
  createCategory(
    'Electronics & Components',
    'electronics',
    'PCBs, semiconductors, integrated circuits, electronic modules',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    false,
    145
  ),
  createCategory(
    'Automotive & Spare Parts',
    'automotive',
    'Batteries, tyres, engine oils, auto parts, vehicle accessories',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    false,
    132
  ),
  createCategory(
    'Agriculture & Organic',
    'agriculture',
    'Seeds, fertilizers, pesticides, organic products, farming tools',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad206?w=800',
    false,
    119
  ),
  createCategory(
    'Packaging Materials',
    'packaging',
    'Boxes, bottles, wrapping materials, containers, labels',
    'https://images.unsplash.com/photo-1607354247980-09a0c8ee4639?w=800',
    false,
    108
  ),
  createCategory(
    'Pet Supplies',
    'pet-supplies',
    'Pet food, grooming products, pet accessories, veterinary supplies',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    false,
    74
  ),
];

// Helper to get icon data by slug
export const getCategoryIcon = (slug) => {
  if (!slug) return { icon: FaBox, color: 'text-slate-600', bg: 'bg-slate-100' };
  const normalizedSlug = slug.toLowerCase();
  const iconData = categoryIcons[normalizedSlug];
  if (iconData) {
    return { icon: iconData.icon, color: iconData.color, bg: iconData.bg };
  }
  // Try matching partial slug
  for (const [key, value] of Object.entries(categoryIcons)) {
    if (normalizedSlug.includes(key) || key.includes(normalizedSlug)) {
      return { icon: value.icon, color: value.color, bg: value.bg };
    }
  }
  return { icon: FaBox, color: 'text-slate-600', bg: 'bg-slate-100' };
};

// Merge API categories with default categories (no duplicates)
export const mergeCategories = (apiCategories, defaults = defaultCategories) => {
  const merged = [...defaults];
  const existingSlugs = new Set(defaults.map(c => c.slug.toLowerCase()));
  
  (apiCategories || []).forEach(apiCat => {
    const slug = (apiCat.slug || apiCat.name?.toLowerCase().replace(/\s+/g, '-') || '').toLowerCase();
    const name = apiCat.name || slug;
    
    // Skip if already exists in defaults
    if (existingSlugs.has(slug)) {
      // Update existing category with API data if provided
      const index = merged.findIndex(c => c.slug.toLowerCase() === slug);
      if (index !== -1) {
        merged[index] = {
          ...merged[index],
          name: name.charAt(0).toUpperCase() + name.slice(1),
          desc: apiCat.description || merged[index].desc,
          image: apiCat.image || merged[index].image,
          subcategories: apiCat.subcategories || merged[index].subcategories,
        };
      }
      return;
    }
    
    // Add new category from API
    const iconData = getCategoryIcon(slug);
    merged.push({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug,
      desc: apiCat.description || "Premium quality products available",
      image: apiCat.image || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
      popular: false,
      count: 0,
      subcategories: apiCat.subcategories || [],
      getIcon: () => iconData,
    });
    existingSlugs.add(slug);
  });
  
  return merged;
};

export default defaultCategories;
