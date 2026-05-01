// src/Pages/CompanyDetail.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Boxes, Building2, Globe, Mail, MapPin, Phone, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

const toTitle = (value = '') =>
  value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/companies/${id}`);
        setCompany(res.data.company || null);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to fetch company details:', err);
        setError(err.response?.data?.message || 'Company details not available');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading associate profile...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-2xl font-semibold text-gray-900">Associate not found</p>
          <p className="mt-3 text-gray-600">{error || 'This business page is not available right now.'}</p>
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-2xl font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Associates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <Link 
          to="/companies" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Our Associates
        </Link>

        <section className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-blue-700 to-orange-600 px-8 py-12 text-white">
            <p className="text-sm uppercase tracking-widest text-blue-100">BUSINESS PROFILE</p>
            
            {company.isPremium && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2 text-sm font-semibold mt-4">
                <Star className="w-4 h-4 fill-current" /> PREMIUM SELLER
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
              {company.avatar ? (
                <img
                  src={company.avatar}
                  alt={company.company}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white/50 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-white/20 border border-white/30 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-5xl font-bold tracking-tight">{company.company}</h1>
                {company.name && (
                  <p className="mt-2 text-xl text-white/90">by {company.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8 lg:p-10">
            
            {/* Left Column - About & Details */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-gray-50 p-6 border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Boxes className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Listed Products</span>
                  </div>
                  <p className="mt-4 text-4xl font-bold text-gray-900">
                    {company.productCount || products.length}
                  </p>
                </div>

                <div className="rounded-3xl bg-gray-50 p-6 border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Tag className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Categories</span>
                  </div>
                  <p className="mt-4 text-3xl font-bold text-gray-900">
                    {(company.categories || []).length || 1}
                  </p>
                </div>
              </div>

              {/* About Section */}
              <div className="rounded-3xl border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Business</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-gray-700">
                  {company.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{company.address}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <Globe className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-orange-600 hover:underline break-all"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>

                {(company.categories || []).length > 0 && (
                  <div className="mt-8">
                    <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-3">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {company.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-100"
                        >
                          {toTitle(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Quick Info */}
            <div className="rounded-3xl bg-slate-900 text-white p-8 h-fit">
              <p className="uppercase tracking-widest text-orange-400 text-sm font-medium">Quick Overview</p>
              <h2 className="mt-3 text-3xl font-semibold">Explore Products</h2>
              <p className="mt-4 text-slate-300 text-[15px]">
                Browse all products listed by this associate with pricing and specifications.
              </p>

              <div className="mt-8 space-y-5">
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Business Type</p>
                  <p className="mt-1 text-lg font-medium">{company.businessType || 'General Supplier'}</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-slate-400">GST Number</p>
                  <p className="mt-1 text-lg font-medium break-all">
                    {company.gstNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="mt-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="uppercase tracking-widest text-xs text-gray-500">PRODUCT CATALOG</p>
              <h2 className="text-3xl font-bold text-gray-900">Associated Products</h2>
            </div>
            <p className="text-gray-600 font-medium">{products.length} products</p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center">
              <p className="text-gray-500 text-lg">No products available from this associate at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={product.images?.[0] || 'https://picsum.photos/seed/product/800/500'}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs px-3 py-1 bg-orange-50 text-orange-700 rounded-full">
                        {toTitle(product.category)}
                      </span>
                      <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                        {toTitle(product.subcategory)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-2xl font-bold text-orange-600">
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      MOQ: {product.moq || 'N/A'}
                    </p>

                    {product.description && (
                      <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                        {product.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}