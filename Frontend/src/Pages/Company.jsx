import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Phone, Star, ArrowRight, Boxes, MapPin } from 'lucide-react';
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
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            VERIFIED ASSOCIATES • PAN INDIA
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Our Associates
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Browse registered businesses, view their details, and open all associated products in one click
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search associate, company, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-3xl border border-gray-200 focus:border-emerald-500 focus:outline-none text-lg shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600" />

              <div className="p-6">
                {company.isPremium && (
                  <div className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold mb-3">
                    Premium Seller
                  </div>
                )}

                <h3 className="font-bold text-2xl text-gray-900 line-clamp-2 mb-1">
                  {company.company || 'Unnamed Company'}
                </h3>

                {company.name && (
                  <p className="text-emerald-700 font-medium text-sm mb-4">
                    by {company.name}
                  </p>
                )}

                <div className="space-y-3 text-sm mb-6">
                  {company.productCount ? (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Boxes className="w-4 h-4" />
                      <span>{company.productCount} listed products</span>
                    </div>
                  ) : null}
                  {company.location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-8">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>4.8</span>
                  </div>
                  <div>Verified Associate</div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/company/${company._id}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/company/${company._id}`}
                    className="flex-1 border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 py-3.5 rounded-2xl font-medium text-center transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No associates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
