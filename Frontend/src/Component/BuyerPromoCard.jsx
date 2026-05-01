// src/Component/BuyerPromoCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearchDollar, FaFileSignature, FaHandshake, FaShieldAlt, FaRocket, FaPaperPlane } from 'react-icons/fa';

const BuyerPromoCard = () => {
  const buyerBenefits = [
    { 
      icon: <FaSearchDollar className="text-4xl text-orange-600" />, 
      title: "Post Requirements Easily", 
      desc: "Share your exact product needs, quantity, specs & target price in minutes" 
    },
    { 
      icon: <FaFileSignature className="text-4xl text-blue-600" />, 
      title: "Receive Multiple Quotes", 
      desc: "Get competitive offers from verified global suppliers quickly" 
    },
    { 
      icon: <FaHandshake className="text-4xl text-orange-600" />, 
      title: "Compare & Negotiate", 
      desc: "Review proposals, chat directly, and secure the best deal" 
    },
    { 
      icon: <FaShieldAlt className="text-4xl text-blue-600" />, 
      title: "Safe & Secure Process", 
      desc: "Protected inquiries, verified suppliers, transparent communication" 
    },
    { 
      icon: <FaRocket className="text-4xl text-orange-600" />, 
      title: "Source Faster & Smarter", 
      desc: "Save time, reduce costs, and find reliable partners worldwide" 
    },
  ];

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
    console.log('Requirement posted:', formData);
    
    setSubmitted(true);
    
    // Reset form after success message
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        product: '', description: '', quantity: '', targetPrice: '',
        deliveryDate: '', name: '', email: '', phone: '', company: ''
      });
    }, 5000);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            Thousands of verified manufacturers and exporters are ready to meet your business needs.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 mb-16">
          {buyerBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-7 lg:p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-3 group"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">
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
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556740714-a8395b3a74dd?auto=format&fit=crop&q=80&w=2070')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-900/80 to-orange-900/70" />

          <div className="relative z-10 py-16 lg:py-20 px-6 lg:px-12 text-center max-w-5xl mx-auto">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Source Better Deals?
            </h3>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Post your requirement for free • Receive quotes in hours • No obligation
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white p-10 rounded-3xl text-xl font-semibold"
              >
                ✅ Thank you! Your requirement has been posted successfully.<br />
                <span className="text-lg mt-3 block opacity-90">
                  Our team will connect you with relevant suppliers soon.
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Product / Category <span className="text-orange-400">*</span></label>
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                      placeholder="e.g. HDPE Granules, Nitrile Gloves, Cotton Fabric"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Quantity Needed <span className="text-orange-400">*</span></label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 5 Tons, 10,000 Pieces, 2 Containers"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Target Price (Optional)</label>
                    <input
                      type="text"
                      name="targetPrice"
                      value={formData.targetPrice}
                      onChange={handleChange}
                      placeholder="e.g. ₹150/kg or $2.5 max"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Detailed Requirements <span className="text-orange-400">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Material grade, specifications, certifications, packaging requirements, etc."
                      className="w-full px-5 py-4 rounded-3xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Expected Delivery Timeline</label>
                    <input
                      type="text"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      placeholder="e.g. Within 30-45 days"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Contact Details - Full Width */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Your Full Name <span className="text-orange-400">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Email Address <span className="text-orange-400">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Phone Number <span className="text-orange-400">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Company Name <span className="text-orange-400">*</span></label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-8">
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 
                               text-white font-bold text-xl py-6 rounded-2xl 
                               shadow-lg shadow-orange-500/40 transition-all duration-300 
                               hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <FaPaperPlane className="text-xl" />
                    Post Requirement — It's Completely Free
                  </button>
                </div>

                <p className="md:col-span-2 text-center text-blue-100/90 text-base mt-4">
                  Your information is safe with us • We respect your privacy
                </p>
              </form>
            )}

            <p className="mt-12 text-blue-100/80 text-lg">
              Join thousands of smart buyers sourcing quality products globally every day
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BuyerPromoCard;