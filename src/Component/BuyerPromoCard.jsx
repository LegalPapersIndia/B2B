// src/Component/BuyerPromoCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearchDollar, FaFileSignature, FaHandshake, FaShieldAlt, FaRocket, FaPaperPlane } from 'react-icons/fa';

const BuyerPromoCard = () => {
  const buyerBenefits = [
    { 
      icon: <FaSearchDollar className="text-4xl text-emerald-600" />, 
      title: "Post Requirements Easily", 
      desc: "Share your exact product needs, quantity, specs & target price in minutes" 
    },
    { 
      icon: <FaFileSignature className="text-4xl text-indigo-600" />, 
      title: "Receive Multiple Quotes", 
      desc: "Get competitive offers from verified global suppliers quickly" 
    },
    { 
      icon: <FaHandshake className="text-4xl text-blue-600" />, 
      title: "Compare & Negotiate", 
      desc: "Review proposals, chat directly, and secure the best deal" 
    },
    { 
      icon: <FaShieldAlt className="text-4xl text-teal-600" />, 
      title: "Safe & Secure Process", 
      desc: "Protected inquiries, verified suppliers, transparent communication" 
    },
    { 
      icon: <FaRocket className="text-4xl text-purple-600" />, 
      title: "Source Faster & Smarter", 
      desc: "Save time, reduce costs, and find reliable partners worldwide" 
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    product: '',
    description: '',
    quantity: '',
    targetPrice: '',
    deliveryDate: '',
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real API call (axios.post('/api/requirements', formData))
    console.log('Requirement posted:', formData);
    setSubmitted(true);
    // Optional: reset form after 3 seconds or redirect
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 via-white to-blue-50/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            Post Your Requirement Today
          </h2>
          <p className="mt-5 text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-light">
            Find the Best Suppliers • Get Competitive Quotes • Source Smarter
          </p>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Thousands of verified manufacturers and exporters are ready to meet your business needs — start sourcing globally with ease.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {buyerBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl border border-gray-100/70 transition-all duration-500 hover:-translate-y-3 group"
            >
              <div className="mb-5 transform group-hover:scale-110 transition-transform duration-500">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-base">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main CTA + Form Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556740714-a8395b3a74dd?auto=format&fit=crop&q=80&w=2070')`, // fallback nice business/trade image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-indigo-900/80" />

          <div className="relative z-10 py-16 lg:py-20 px-6 lg:px-12 text-center max-w-5xl mx-auto">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Source Better Deals?
            </h3>
            <p className="text-xl lg:text-2xl text-emerald-100 mb-10">
              Post your requirement for free • Receive quotes in hours • No obligation to buy
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-700/30 backdrop-blur-md text-white p-8 rounded-2xl text-xl font-semibold"
              >
                Thank you! Your requirement has been posted.<br />
                <span className="text-lg mt-2 block">Suppliers will contact you soon.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-4xl mx-auto">
                {/* Left column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Product / Category *</label>
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Stainless Steel Pipes, Organic Spices, Pharma APIs"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Quantity Needed *</label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 5000 units / 20 tons / 1000 kg"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Target Price (optional)</label>
                    <input
                      type="text"
                      name="targetPrice"
                      value={formData.targetPrice}
                      onChange={handleChange}
                      placeholder="e.g. ₹150-200 per unit / $2.5 max"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Detailed Specs / Requirements *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Material grade, dimensions, certifications, packaging, etc."
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Expected Delivery / Timeline</label>
                    <input
                      type="text"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      placeholder="e.g. Within 45 days / By March 2026"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Full-width contact fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Phone (with country code) *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 px-12 py-5 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-98 flex items-center justify-center gap-3 mx-auto"
                  >
                    <FaPaperPlane className="text-xl" />
                    Post Requirement — It's Free
                  </button>
                </div>

                <p className="md:col-span-2 text-center text-emerald-100/90 text-base mt-4">
                  Your details are safe with us • We never sell or spam your information
                </p>
              </form>
            )}

            <p className="mt-10 text-emerald-100/90 text-lg">
              Join thousands of smart buyers sourcing quality products globally every day
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BuyerPromoCard;