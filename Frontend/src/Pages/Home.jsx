import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import HeroCarousel from '../Component/HeroCarousel';
import Sidebar from '../Component/SideBar';
import ActionSidebar from '../Component/ActionSide';
import PromoCard from '../Component/PromoCard';
import BuyerPromoCard from '../Component/BuyerPromoCard';
import Testimonials from '../Component/Testimonials';
import CategoryShowcase from '../Component/CategoryShowcase';
import ManufacturingHubsCarousel from '../Component/ManufacturingHubsCarousel';

// NEW IMPORT
import AllCompanies from '../Component/AllCompanies';   // ← We'll create this

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : 'http://localhost:5000/api';

export default function Home() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEnquiry = async (product) => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    if (user?.unsafeMetadata?.role !== 'buyer') {
      alert("Only Buyers can send inquiries. Please switch to Buyer account.");
      return;
    }

    const message = prompt("Enter your message (optional):") || 
                    "I am interested in this product. Please provide more details and best price.";

    try {
      const token = await getToken();
      
      await axios.post(`${API_BASE_URL}/enquiries`, {
        productId: product._id,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Inquiry sent successfully to the seller!");
    } catch (err) {
      console.error("Enquiry error:", err);
      alert(err.response?.data?.message || "Failed to send inquiry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Hero + Sidebars */}
      <div className="mx-auto max-w-[1400px] xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row gap-0 lg:gap-6 xl:gap-8">
          <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <Sidebar />
          </aside>

          <div className="flex-1 min-w-0 lg:mt-10 z-10">
            <HeroCarousel />
          </div>

          <aside className="hidden xl:block xl:w-80 shrink-0">
            <div className="sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-2xl shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/60">
              <ActionSidebar />
            </div>
          </aside>
        </div>
      </div>

      {/* Main Sections - Order is important */}
      <CategoryShowcase />
      
      <ManufacturingHubsCarousel />

      {/* 🔥 NEW SECTION ADDED HERE - Best Position */}
      <AllCompanies />

      {/* Promotional & Testimonial Sections */}
      <PromoCard />
      <BuyerPromoCard />
      <Testimonials />
    </div>
  );
}