import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

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
  const { isLoaded, isSignedIn, user } = useUser();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [revealedContact, setRevealedContact] = useState(null);

  const isProfileComplete =
    user?.unsafeMetadata?.profileCompleted === true ||
    (user?.unsafeMetadata?.businessName &&
      user?.unsafeMetadata?.mobile &&
      user?.unsafeMetadata?.address);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isProfileComplete) {
      navigate("/complete-profile", { replace: true });
      return;
    }
    fetchProducts();
  }, [isLoaded, isSignedIn, isProfileComplete, slug, subslug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/products?category=${encodeURIComponent(slug)}&subcategory=${encodeURIComponent(subslug)}`
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
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

  const buildContactAction = (type, value) => {
    if (!value) return null;
    if (type === "phone") return `tel:${value}`;
    if (type === "email") return `mailto:${value}`;
    if (type === "website") return value.startsWith("http") ? value : `https://${value}`;
    return null;
  };

  if (!isLoaded || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2">{heading}</h1>
        <p className="text-gray-600 mb-8">Products from same subcategory</p>

        {products.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-gray-500">
            No products found for this subcategory.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const seller = p.seller || {};
              return (
                <div key={p._id} className="bg-white rounded-2xl border hover:shadow-lg transition">
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
                    <p className="text-sm text-gray-600 mt-2">
                      Seller: {seller.name || p.sellerName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Company: {seller.company || p.sellerCompany || "N/A"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => revealContact(p._id, "phone", seller.phone)}
                        className={`px-3 py-2 rounded-lg text-white text-sm ${seller.phone ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        Phone
                      </button>
                      <button
                        type="button"
                        onClick={() => revealContact(p._id, "email", seller.email)}
                        className={`px-3 py-2 rounded-lg text-white text-sm ${seller.email ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => revealContact(p._id, "website", seller.website)}
                        className={`px-3 py-2 rounded-lg text-white text-sm ${seller.website ? "bg-slate-800 hover:bg-black" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        Website
                      </button>
                    </div>

                    {revealedContact?.productId === p._id && (
                      <div className="mt-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-sm">
                        <p className="text-gray-700 mb-2">
                          <span className="font-semibold capitalize">{revealedContact.type}:</span>{" "}
                          {revealedContact.value}
                        </p>
                        {buildContactAction(revealedContact.type, revealedContact.value) && (
                          <a
                            href={buildContactAction(revealedContact.type, revealedContact.value)}
                            target={revealedContact.type === "website" ? "_blank" : undefined}
                            rel={revealedContact.type === "website" ? "noreferrer" : undefined}
                            className="inline-block px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium"
                          >
                            {revealedContact.type === "phone"
                              ? "Call Now"
                              : revealedContact.type === "email"
                              ? "Send Email"
                              : "Visit Website"}
                          </a>
                        )}
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
