// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Component/Navbar';
import Home from './Pages/Home';
import AboutUs from './Pages/About';     // ← import your About page
import Footer from './Component/Footer';
import './App.css';
import ContactUs from './Pages/Contact';
import PrivacyPolicy from './Pages/Privacy';
import RefundPolicy from './Pages/Refund';
import HelpCenter from './Pages/HelpCenter';
import Blog from './Pages/Blog';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />  
            <Route path="/help" element={<HelpCenter />} /> 
            <Route path="/blog" element={<Blog />} />
            {/* Add more pages later if needed */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;