import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Boxes, Globe, Mail, MapPin, Phone, Tag } from 'lucide-react';

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
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading associate...</div>;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center">
          <p className="text-2xl font-semibold text-slate-900">Associate not found</p>
          <p className="mt-3 text-slate-600">{error || 'This business page is not available right now.'}</p>
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Associates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/companies" className="inline-flex items-center gap-2 text-emerald-700 font-medium mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Our Associates
        </Link>

        <section className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 px-8 py-10 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Business Profile</p>
            {company.isPremium && (
              <div className="inline-flex items-center rounded-full bg-amber-300/20 border border-amber-200/40 text-amber-50 px-4 py-2 text-sm font-semibold mt-4">
                Premium Seller
              </div>
            )}
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">{company.company}</h1>
            <p className="mt-3 text-emerald-50 text-lg">
              {company.name ? `Primary contact: ${company.name}` : 'Registered business on our marketplace'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Boxes className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Listed Products</span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{company.productCount || products.length}</p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Tag className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Categories</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900">
                    {(company.categories || []).length || 1}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-900">About This Business</h2>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                  {company.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <span>{company.address}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <span>{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <Globe className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-emerald-700 break-all">
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>

                {(company.categories || []).length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Categories</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {company.categories.map((category) => (
                        <span
                          key={category}
                          className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100"
                        >
                          {toTitle(category)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 text-white p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Explore</p>
              <h2 className="mt-3 text-3xl font-semibold">All products from this associate</h2>
              <p className="mt-4 text-slate-300">
                Buyer ko ek hi page par business details, listed products, pricing, and taxonomy information mil jayegi.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-sm text-slate-300">Business type</p>
                  <p className="mt-1 text-lg font-medium">{company.businessType || 'General Supplier'}</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-sm text-slate-300">GST Number</p>
                  <p className="mt-1 text-lg font-medium">{company.gstNumber || 'Not shared'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Product Catalog</p>
              <h2 className="text-3xl font-bold text-slate-900">Associated Products</h2>
            </div>
            <p className="text-slate-600">{products.length} products found</p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              No products available for this associate right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <article key={product._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <img
                    src={product.images?.[0] || 'https://picsum.photos/seed/company-product/800/500'}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 text-xs font-medium mb-3">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {toTitle(product.category)}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {toTitle(product.subcategory)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                    <p className="mt-3 text-2xl font-bold text-emerald-700">
                      Rs {Number(product.price || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">MOQ: {product.moq || 'N/A'}</p>
                    {product.description && (
                      <p className="mt-4 text-sm text-slate-600 line-clamp-3">{product.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
