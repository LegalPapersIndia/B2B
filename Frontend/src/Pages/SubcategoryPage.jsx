// src/Pages/SubcategoryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Star, Phone, Mail, Globe, MapPin, Briefcase, ExternalLink } from "lucide-react";
import axios from "axios";
import { useAppAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

const toTitle = (value = "") =>
  value
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

function SubcategoryPage() {
  const navigate = useNavigate();
  const { slug, subslug } = useParams();
  const { isLoaded, user, getToken, isProfileComplete } = useAppAuth();

const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [revealedContact, setRevealedContact] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    const init = async () => {
      const token = await getToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      if (!isProfileComplete) {
        navigate("/complete-profile", { replace: true });
        return;
      }

      fetchProducts();
    };

    init();
  }, [isLoaded, isProfileComplete, slug, subslug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/products?category=${encodeURIComponent(slug)}&subcategory=${encodeURIComponent(subslug)}`
      );

      let fetchedProducts = Array.isArray(res.data) ? res.data : res.data?.products || [];

      // Add premium flag and sort premium first
      fetchedProducts = fetchedProducts
        .map((product) => ({
          ...product,
          isPremiumSeller: product.seller?.isPremium === true,
        }))
        .sort((a, b) => {
          if (a.isPremiumSeller && !b.isPremiumSeller) return -1;
          if (!a.isPremiumSeller && b.isPremiumSeller) return 1;
          return 0;
        });

      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching subcategory products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const heading = useMemo(() => `${toTitle(slug)} / ${toTitle(subslug)}`, [slug, subslug]);

  const revealContact = (productId, type, value) => {
    if (!value) return;
    setRevealedContact({ productId, type, value });
  };

  const recordContactClick = async (productId, type) => {
    try {
      const token = await getToken();
      if (!token) return;

      await axios.post(
        `${API_BASE_URL}/enquiries/contact-click`,
        {
          productId,
          contactMethod: type,
          buyerName: user?.fullName || user?.firstName || "",
          buyerEmail: user?.primaryEmailAddress?.emailAddress || "",
          buyerPhone: user?.primaryPhoneNumber?.phoneNumber || user?.unsafeMetadata?.mobile || "",
          buyerCompany: user?.unsafeMetadata?.businessName || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Contact click tracking failed:", err.message);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Category
        </button>

        <h1 className="text-4xl font-bold mb-2 text-gray-900">{heading}</h1>
        <p className="text-gray-600 mb-10">Showing products from this subcategory</p>

        {products.length === 0 ? (
          <div className="bg-white border rounded-3xl p-16 text-center">
            <p className="text-gray-500 text-lg">No products found in this subcategory yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const seller = p.seller || {};

              return (
                <motion.div
                  key={p._id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all relative group"
                >
                  {/* Premium Badge */}
                  {p.isPremiumSeller && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                        <Star className="w-4 h-4 fill-current" />
                        PREMIUM SELLER
                      </div>
                    </div>
                  )}

                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={p.images?.[0] || "https://picsum.photos/id/20/600/400"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

<div className="p-6">
                    <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 mb-2">
                      {p.name}
                    </h3>

                    {/* Product Description with Read More */}
                    {p.description && (
                      <div className="mb-3">
                        <p className={`text-sm text-gray-600 ${expandedDesc === p._id ? '' : 'line-clamp-2'}`}>
                          {p.description}
                        </p>
                        {p.description.length > 100 && (
                          <button
                            onClick={() => setExpandedDesc(expandedDesc === p._id ? null : p._id)}
                            className="text-xs text-orange-600 font-medium hover:underline mt-1"
                          >
                            {expandedDesc === p._id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{p.price?.toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-gray-500">
                        MOQ: <span className="font-medium">{p.moq || "N/A"}</span>
                      </p>
                    </div>

                    {seller && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          {seller.avatar ? (
                            <img
                              src={seller.avatar}
                              alt={seller.company}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {seller.company}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                              {seller.businessType && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {seller.businessType}
                                </span>
                              )}
                              {seller.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {seller.city}{seller.state ? `, ${seller.state}` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          {seller._id && (
                            <Link
                              to={`/company/${seller._id}`}
                              className="flex items-center gap-1 text-xs text-orange-600 font-medium hover:underline"
                            >
                              View Profile
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="grid grid-cols-3 gap-2 mt-8">
                      <button
                        onClick={async () => {
                          revealContact(p._id, "phone", seller.phone);
                          if (seller.phone) await recordContactClick(p._id, "phone");
                        }}
                        className="flex flex-col items-center justify-center py-3 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all text-blue-700 text-sm font-medium"
                      >
                        <Phone className="w-5 h-5 mb-1" />
                        Phone
                      </button>

                      <button
                        onClick={() => {
                          revealContact(p._id, "email", seller.email);
                          if (seller.email) recordContactClick(p._id, "email");
                        }}
                        className="flex flex-col items-center justify-center py-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all text-emerald-700 text-sm font-medium"
                      >
                        <Mail className="w-5 h-5 mb-1" />
                        Email
                      </button>

                      {seller.website && (
                        <button
                          onClick={() => {
                            revealContact(p._id, "website", seller.website);
                            recordContactClick(p._id, "website");
                          }}
                          className="flex flex-col items-center justify-center py-3 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-all text-purple-700 text-sm font-medium"
                        >
                          <Globe className="w-5 h-5 mb-1" />
                          Website
                        </button>
                      )}
                    </div>

                    {/* Revealed Contact Info */}
                    {revealedContact?.productId === p._id && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm">
                        <strong className="capitalize">{revealedContact.type}:</strong>{" "}
                        <span className="font-medium text-gray-800">{revealedContact.value}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubcategoryPage;