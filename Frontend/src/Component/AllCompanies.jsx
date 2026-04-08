// src/Component/AllCompanies.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Mail, Phone, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : 'http://localhost:5000/api';

export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(res.data.companies || res.data || []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    (c.company || c.companyName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Featured Sellers
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Trusted manufacturers and suppliers across India
            </p>
          </div>

          <Link 
            to="/companies"
            className="mt-4 md:mt-0 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group"
          >
            View All Companies 
            <ArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading Sellers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCompanies.slice(0, 8).map((company, i) => (   // Show only 8 on home
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                <div className="p-6">
                  <h3 className="font-semibold text-xl line-clamp-2">
                    {company.company || company.companyName}
                  </h3>

                  {company.name && (
                    <p className="text-sm text-emerald-700 mt-1">by {company.name}</p>
                  )}

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
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

                  <Link
                    to={`/company/${company._id}`}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-medium transition-all"
                  >
                    View Profile & Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/companies"
            className="inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-semibold text-lg transition"
          >
            Explore All Sellers
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}