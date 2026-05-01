// src/Pages/Companies.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Phone, Star, ArrowRight, Boxes, MapPin, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/companies`);
        setCompanies(res.data.companies || res.data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const query = searchTerm.toLowerCase();
    return (
      (company.company || '').toLowerCase().includes(query) ||
      (company.name || '').toLowerCase().includes(query) ||
      (company.location || '').toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xl text-gray-600">
        Loading associates...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            VERIFIED ASSOCIATES • PAN INDIA
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Our Associates
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Browse registered businesses, view their details, and explore all associated products.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search by company, owner, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-3xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none text-lg shadow-sm"
          />
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all overflow-hidden group border border-gray-100"
            >
              {/* Top Accent Bar */}
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />

              <div className="p-6">
                {/* Logo */}
                <div className="flex items-center justify-between mb-5">
                  {company.avatar ? (
                    <img
                      src={company.avatar}
                      alt={company.company || company.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {company.isPremium && (
                    <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <Star className="w-4 h-4 fill-current" />
                      PREMIUM
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <h3 className="font-bold text-2xl text-gray-900 line-clamp-2 mb-1">
                  {company.company || 'Unnamed Company'}
                </h3>

                {company.name && company.name !== company.company && (
                  <p className="text-blue-700 font-medium text-sm mb-4">
                    by {company.name}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-3 text-sm mb-8 text-gray-600">
                  {company.productCount !== undefined && (
                    <div className="flex items-center gap-3">
                      <Boxes className="w-4 h-4" />
                      <span>{company.productCount} listed products</span>
                    </div>
                  )}

                  {company.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                    </div>
                  )}

                  {company.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{company.email}</span>
                    </div>
                  )}

                  {company.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                </div>

                {/* Rating & Verified */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-8">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span>4.8</span>
                  </div>
                  <div className="text-emerald-600 font-medium">Verified Associate</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/company/${company._id}`}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    Explore Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/company/${company._id}`}
                    className="flex-1 border border-gray-300 hover:border-orange-600 hover:text-orange-600 py-3.5 rounded-2xl font-medium text-center transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No associates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}