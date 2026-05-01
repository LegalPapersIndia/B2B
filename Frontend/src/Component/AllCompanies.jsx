// src/Component/AllCompanies.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Mail, ArrowRight, Boxes, Briefcase, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : 'http://localhost:5000/api';

const toTitle = (value = "") =>
  value
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/companies`);
      let allCompanies = res.data.companies || res.data || [];

      // Premium companies first
      allCompanies.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return 0;
      });

      setCompanies(allCompanies);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Associates
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Trusted businesses with verified products and company details
            </p>
          </div>

          <Link 
            to="/companies"
            className="mt-4 md:mt-0 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            View All Associates
            <ArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading Sellers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {companies.slice(0, 8).map((company, i) => {
              const logo = company.avatar || company.logo || company.profilePhoto;
              const industry = company.industry || company.businessType;

              return (
                <motion.div
                  key={company._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Top Accent Bar - Orange Theme */}
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />

                  <div className="p-6">
                    {/* Logo + Premium Badge */}
                    <div className="flex items-center justify-between mb-4">
                      {logo ? (
                        <img
                          src={logo}
                          alt={company.company}
                          className="w-16 h-16 object-cover rounded-2xl border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {company.isPremium && (
                        <div className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold">
                          ⭐ Premium
                        </div>
                      )}
                    </div>

                    {/* Company Name */}
                    <h3 className="font-semibold text-xl line-clamp-2 mt-2 text-gray-900">
                      {company.company || company.companyName || company.name}
                    </h3>

                    {/* Owner Name */}
                    {company.name && company.name !== (company.company || company.companyName) && (
                      <p className="text-sm text-blue-700 mt-1">by {company.name}</p>
                    )}

                    {/* Industry */}
                    {industry && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-2xl text-sm font-medium">
                        <Briefcase className="w-4 h-4" />
                        {toTitle(industry)}
                      </div>
                    )}

                    {/* Details */}
                    <div className="mt-5 space-y-2.5 text-sm text-gray-600">
                      {company.productCount !== undefined && company.productCount > 0 && (
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4" />
                          <span>{company.productCount} products</span>
                        </div>
                      )}

                      {company.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{company.email}</span>
                        </div>
                      )}

                      {company.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {company.location}
                        </div>
                      )}
                    </div>

                    {/* Explore Button - Orange Theme */}
                    <Link
                      to={`/company/${company._id}`}
                      className="mt-7 w-full flex items-center justify-center gap-2 
                                 bg-orange-600 hover:bg-orange-700 
                                 text-white py-3.5 rounded-2xl font-medium 
                                 transition-all active:scale-[0.98]"
                    >
                      Explore Products
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Button - Blue Theme */}
        <div className="text-center mt-14">
          <Link
            to="/companies"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 
                       text-white px-10 py-4 rounded-2xl font-semibold text-lg 
                       transition-all active:scale-[0.98]"
          >
            Explore All Associates
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}