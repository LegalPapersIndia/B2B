import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
        `${API_BASE_URL}/products?category=${encodeURIComponent(
          slug
        )}&subcategory=${encodeURIComponent(subslug)}`
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const heading = useMemo(
    () => `${toTitle(slug)} / ${toTitle(subslug)}`,
    [slug, subslug]
  );

  const revealContact = (productId, type, value) => {
    if (!value) return;
    setRevealedContact({ productId, type, value });
  };

  const recordContactClick = async (productId, type) => {
    try {
      const token = await getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/enquiries/contact-click`,
        {
          productId,
          contactMethod: type,
          buyerName: user?.fullName || user?.firstName || "",
          buyerEmail: user?.primaryEmailAddress?.emailAddress || "",
          buyerPhone:
            user?.primaryPhoneNumber?.phoneNumber ||
            user?.unsafeMetadata?.mobile ||
            "",
          buyerCompany: user?.unsafeMetadata?.businessName || "",
          buyerWebsite: user?.unsafeMetadata?.website || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Contact click tracking failed:", err.message);
    }
  };

  const buildContactAction = (type, value) => {
    if (!value) return null;
    if (type === "phone") return `tel:${value}`;
    if (type === "email") return `mailto:${value}`;
    if (type === "website")
      return value.startsWith("http") ? value : `https://${value}`;
    return null;
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
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
            No products found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const seller = p.seller || {};
              return (
                <div key={p._id} className="bg-white rounded-2xl border">
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="w-full h-52 object-cover rounded-t-2xl"
                  />

                  <div className="p-5">
                    <h3 className="font-semibold">{p.name}</h3>

<div className="flex gap-2 mt-4">
  <button
    onClick={async () => {
      revealContact(p._id, "phone", seller.phone);
      if (seller.phone)
        await recordContactClick(p._id, "phone");
    }}
    className="bg-blue-600 text-white px-3 py-2 rounded"
  >
    Phone
  </button>

  <button
    onClick={() => {
      revealContact(p._id, "email", seller.email);
      if (seller.email)
        recordContactClick(p._id, "email");
    }}
    className="bg-emerald-600 text-white px-3 py-2 rounded"
  >
    Email
  </button>

  {seller.website && (
    <button
      onClick={() => {
        revealContact(p._id, "website", seller.website);
        recordContactClick(p._id, "website");
      }}
      className="bg-purple-600 text-white px-3 py-2 rounded"
    >
      Website
    </button>
  )}
</div>

                    {revealedContact?.productId === p._id && (
                      <div className="mt-3">
{revealedContact?.productId === p._id && (
  <div className="mt-3 text-sm text-gray-700">
    <strong>{revealedContact.type.toUpperCase()}:</strong>{" "}
    {revealedContact.value}
  </div>
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