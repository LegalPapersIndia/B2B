import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Star } from "lucide-react";
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

      let fetchedProducts = Array.isArray(res.data) ? res.data : [];

      // Premium logic + Sorting
      fetchedProducts = fetchedProducts
        .map((product) => {
          const seller = product.seller || {};
          return {
            ...product,
            isPremiumSeller: seller.isPremium === true,
          };
        })
        // 🔥 Premium products ko sabse upar laane ke liye sorting
        .sort((a, b) => {
          if (a.isPremiumSeller && !b.isPremiumSeller) return -1;
          if (!a.isPremiumSeller && b.isPremiumSeller) return 1;
          return 0; // dono same category (premium ya normal) mein hain toh order same rakho
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
          buyerWebsite: user?.unsafeMetadata?.website || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Contact click tracking failed:", err.message);
    }
  };

  if (!isLoaded || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2">{heading}</h1>

        {products.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center">
            No products found in this subcategory.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const seller = p.seller || {};

              return (
                <div 
                  key={p._id} 
                  className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition relative"
                >
                  {/* Premium Seller Badge */}
                  {p.isPremiumSeller && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md">
                        <Star className="w-4 h-4 fill-current" />
                        PREMIUM SELLER
                      </div>
                    </div>
                  )}

                  <img
                    src={p.images?.[0] || "https://picsum.photos/id/20/600/400"}
                    alt={p.name}
                    className="w-full h-52 object-cover rounded-t-2xl"
                  />

                  <div className="p-5">
                    <h3 className="font-semibold text-lg line-clamp-2">{p.name}</h3>
                    
                    <p className="text-emerald-600 font-bold text-xl mt-1">
                      Rs {p.price?.toLocaleString("en-IN")}
                    </p>
                    
                    <p className="text-sm text-gray-500 mt-1">MOQ: {p.moq || "N/A"}</p>

                    {seller.company && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        {seller.avatar ? (
                          <img
                            src={seller.avatar}
                            alt={seller.company}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span>
                          by <span className="font-medium">{seller.company}</span>
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={async () => {
                          revealContact(p._id, "phone", seller.phone);
                          if (seller.phone) await recordContactClick(p._id, "phone");
                        }}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Phone
                      </button>

                      <button
                        onClick={() => {
                          revealContact(p._id, "email", seller.email);
                          if (seller.email) recordContactClick(p._id, "email");
                        }}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                      >
                        Email
                      </button>

                      {seller.website && (
                        <button
                          onClick={() => {
                            revealContact(p._id, "website", seller.website);
                            recordContactClick(p._id, "website");
                          }}
                          className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                        >
                          Website
                        </button>
                      )}
                    </div>

                    {revealedContact?.productId === p._id && (
                      <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">
                        <strong>{revealedContact.type.toUpperCase()}:</strong>{" "}
                        {revealedContact.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubcategoryPage;
