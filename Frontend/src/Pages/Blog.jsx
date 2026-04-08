// src/Pages/Blog.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaTag, FaArrowRight } from 'react-icons/fa';

// Sample blog data (you can later fetch from API / CMS)
const blogPosts = [
  {
    id: 1,
    title: "How to Choose Reliable Suppliers in 2025: A Complete Guide",
    excerpt: "Learn the essential steps to verify suppliers, check certifications, evaluate MOQs, and avoid common pitfalls in global sourcing.",
    category: "Sourcing Tips",
    author: "Rahul Gupta",
    date: "Feb 15, 2025",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    id: 2,
    title: "Top 10 Export Trends Shaping Indian B2B Market in 2025",
    excerpt: "From sustainable packaging to digital traceability — discover the trends Indian exporters must adopt to stay competitive globally.",
    category: "Market Trends",
    author: "Priya Sharma",
    date: "Feb 10, 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Understanding MOQ Negotiation: Strategies That Actually Work",
    excerpt: "Practical tips on how buyers and suppliers can negotiate minimum order quantities without damaging the relationship.",
    category: "Negotiation",
    author: "Amit Verma",
    date: "Feb 5, 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1556740714-a8395b3a74dd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "How to Use B2B Portal Analytics to Boost Your Sales",
    excerpt: "A step-by-step guide to understanding your dashboard metrics and turning data into more inquiries and closed deals.",
    category: "Platform Guide",
    author: "Neha Kapoor",
    date: "Jan 28, 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Pharmaceutical Export Compliance: What Indian Suppliers Must Know",
    excerpt: "Key regulations, certifications (WHO-GMP, USFDA), documentation, and common compliance mistakes to avoid.",
    category: "Compliance",
    author: "Dr. Sanjay Mehta",
    date: "Jan 20, 2025",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Sustainable Packaging Trends for Food & Beverage Exporters",
    excerpt: "Eco-friendly materials, biodegradable options, and how to meet international buyer demands for green packaging.",
    category: "Sustainability",
    author: "Anjali Singh",
    date: "Jan 12, 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=800",
  },
];

const categories = [
  "All", "Sourcing Tips", "Market Trends", "Platform Guide",
  "Negotiation", "Compliance", "Sustainability", "Success Stories"
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts by category
  const filteredPosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Featured Post */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-emerald-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-emerald-500/30 backdrop-blur-md rounded-full text-emerald-300 font-semibold mb-6">
                Featured Article
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {featuredPost.title}
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaUser /> {featuredPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <FaClock /> {featuredPost.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <FaTag /> {featuredPost.category}
                </div>
              </div>
              <button className="mt-10 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:scale-[1.02]">
                Read Full Article →
              </button>
            </div>
            <div className="hidden lg:block">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="rounded-2xl shadow-2xl object-cover w-full h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Blog Posts Grid */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="grid md:grid-cols-2 gap-8">
              {currentPosts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <FaUser size={14} /> {post.author}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <FaClock size={14} /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-600 flex items-center gap-1.5">
                        <FaTag size={14} /> {post.category}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 text-sm">
                        Read More <FaArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <span className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-10 lg:sticky lg:top-8 lg:self-start">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-600 mb-6">
                Get the latest B2B trends, sourcing tips, and platform updates directly in your inbox.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Your business email"
                  className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all hover:shadow-xl">
                  Subscribe Now
                </button>
              </form>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Posts</h3>
              <div className="space-y-6">
                {blogPosts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex gap-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 cursor-pointer">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.date} • {post.readTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;