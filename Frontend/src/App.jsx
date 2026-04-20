// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

import Navbar from './Component/Navbar';
import Home from './Pages/Home';
import AboutUs from './Pages/About';    
import Footer from './Component/Footer';
import ContactUs from './Pages/Contact';
import PrivacyPolicy from './Pages/Privacy';
import RefundPolicy from './Pages/Refund';
import HelpCenter from './Pages/HelpCenter';
import Blog from './Pages/Blog';
import SignupPage from './Pages/Signup';
import LoginPage from './Pages/LoginPage';
import SsoCallback from './Pages/SsoCallback';
import SellerDashboard from './Pages/SellerDashboard';

import './App.css';
import CategoryPage from './Pages/Categorypage';
import SubcategoryPage from './Pages/SubcategoryPage';
import ScrollToTop from './Component/ScrollToTop';
import CompleteProfile from './Pages/CompleteProfile';
import CompaniesPage from './Pages/Company';
import CompanyDetail from './Pages/CompanyDetail';

function AppContent() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const metadata = user.unsafeMetadata || {};
    const isProfileComplete = metadata.profileCompleted === true ||
      (metadata.businessName && metadata.mobile && metadata.address);

    // If profile not complete, redirect to complete-profile
    if (!isProfileComplete) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/complete-profile' && currentPath !== '/sso-callback' && currentPath !== '/signup') {
        navigate('/complete-profile', { replace: true });
        return;
      }
    }

    // Profile complete - user can access all pages
    // No role-based redirects needed
  }, [isLoaded, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 antialiased overflow-x-hidden">
      
      <Navbar />
       <ScrollToTop /> 

      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />  
          <Route path="/help" element={<HelpCenter />} /> 
          <Route path="/blog" element={<Blog />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/category/:slug/subcategory/:subslug" element={<SubcategoryPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sso-callback" element={<SsoCallback />} />

          {/* Seller Dashboard */}
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default AppContent;
