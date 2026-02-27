// src/Pages/HelpCenter.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch, FaQuestionCircle, FaHeadset, FaWhatsapp,
  FaEnvelope, FaPhoneAlt, FaPaperPlane, FaSpinner,
  FaShieldAlt, FaShippingFast, FaHandshake, FaFileInvoiceDollar,
} from 'react-icons/fa';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Help ticket submitted:', formData);
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 5000);
    }, 1500);
  };

  const whatsappNumber = "+917505266931";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I need help with B2B Portal")}`;

  const faqCategories = [
    {
      icon: <FaShieldAlt className="text-4xl text-indigo-600" />,
      title: "Account & Verification",
      items: [
        "How to verify my business?",
        "How to reset password?",
        "Why is my account under review?",
      ]
    },
    {
      icon: <FaHandshake className="text-4xl text-emerald-600" />,
      title: "Buying & Inquiries",
      items: [
        "How to post a buying requirement?",
        "How to send inquiry to supplier?",
        "What is MOQ and how to negotiate?",
      ]
    },
    {
      icon: <FaShippingFast className="text-4xl text-blue-600" />,
      title: "Shipping & Delivery",
      items: [
        "Who handles logistics?",
        "How to track my order?",
        "What are shipping charges?",
      ]
    },
    {
      icon: <FaFileInvoiceDollar className="text-4xl text-amber-600" />,
      title: "Payments & Refunds",
      items: [
        "How secure are payments?",
        "Refund & cancellation policy",
        "How to raise a dispute?",
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Search Section */}
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-950 text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Help Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto opacity-90"
          >
            Find answers quickly or get in touch with our support team
          </motion.p>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help (e.g. verification, payment, shipping...)"
              className="w-full pl-14 pr-6 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md text-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Popular Topics */}
        <div className="mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            Popular Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {faqCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-3 text-gray-700">
                  {category.items.map((item, i) => (
                    <li key={i} className="hover:text-indigo-600 cursor-pointer transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Support</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-10 text-center"
                >
                  <div className="text-6xl mb-6">🎉</div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">Thank You!</h3>
                  <p className="text-lg text-gray-700">
                    Your support request has been submitted.<br />
                    Our team will respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white"
                    >
                      <option value="">Select issue type</option>
                      <option value="account">Account / Verification</option>
                      <option value="buying">Buying / Inquiry</option>
                      <option value="selling">Selling / Listing</option>
                      <option value="payment">Payment / Refund</option>
                      <option value="technical">Technical / Website Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-5 px-8 rounded-xl font-bold text-lg transition-all ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:scale-[1.02] active:scale-98'
                      }`}
                    >
                      {loading ? (
                        <>Submitting... <FaSpinner className="animate-spin" size={20} /></>
                      ) : (
                        <>Submit Request <FaPaperPlane size={20} /></>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar - Quick Help */}
          <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            {/* WhatsApp Quick Support */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 bg-green-600 hover:bg-green-700 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03]"
            >
              <FaWhatsapp size={36} />
              <div className="text-left">
                <div className="text-sm opacity-90">Instant Support</div>
                <div>Chat on WhatsApp</div>
              </div>
            </a>

            {/* Contact Cards */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600">
                    <FaPhoneAlt size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <a href="tel:+917505266931" className="font-semibold text-gray-900 hover:text-emerald-600">
                      +91 75052 66931
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-100 rounded-xl text-indigo-600">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Us</p>
                    <a href="mailto:support@b2b.in" className="font-semibold text-gray-900 hover:text-indigo-600">
                      support@b2b.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-4 bg-amber-100 rounded-xl text-amber-600">
                    <FaHeadset size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Support Hours</p>
                    <p className="font-medium text-gray-900">Mon–Sat: 10 AM – 7 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-4 text-gray-700">
                <li><a href="/about" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/refund" className="hover:text-indigo-600 transition-colors">Refund Policy</a></li>
                <li><a href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;