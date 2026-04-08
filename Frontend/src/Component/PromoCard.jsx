// src/components/PromoCard.jsx
import React from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { 
  FaGlobe, FaRocket, FaUsers, FaShieldAlt, FaChartLine, 
  FaLock, FaCheckCircle 
} from 'react-icons/fa';

const PromoCard = () => {
  const benefits = [
    {
      icon: <FaGlobe className="text-5xl text-indigo-600" />,
      title: "Reach Global Buyers",
      desc: "Connect instantly with thousands of serious international buyers 24/7"
    },
    {
      icon: <FaRocket className="text-5xl text-emerald-600" />,
      title: "Accelerate Growth",
      desc: "Scale your export business without geographic or market limitations"
    },
    {
      icon: <FaUsers className="text-5xl text-blue-600" />,
      title: "Trusted & Verified Network",
      desc: "Join a secure community of verified manufacturers and suppliers"
    },
    {
      icon: <FaShieldAlt className="text-5xl text-teal-600" />,
      title: "Secure & Protected",
      desc: "Safe inquiries • Protected transactions • Built-in fraud prevention"
    },
    {
      icon: <FaChartLine className="text-5xl text-purple-600" />,
      title: "Maximum Visibility",
      desc: "Premium listings, analytics dashboard & marketing exposure tools"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (

      <section className="py-20 lg:py-28 bg-gradient-to-b from-indigo-50/70 via-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Register Your Business Today
            </h2>
            <p className="mt-6 text-xl sm:text-2xl text-gray-700 font-light max-w-4xl mx-auto">
              Expand Globally • Reach Thousands of Serious Buyers • Grow Without Limits
            </p>
            <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of manufacturers, exporters and suppliers already succeeding on the fastest-growing B2B marketplace.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 mb-16 lg:mb-20"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500 ease-out">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-700 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA Card - Enhanced Glassmorphism */}
          <div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)',
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:50px_50px]" />

            <div className="relative z-10 py-16 lg:py-24 px-6 sm:px-12 lg:px-20 text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Ready to Take Your Business Global?
              </h3>

              <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
                Free registration • Zero setup fees • Start receiving serious buyer inquiries within hours
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white text-indigo-700 hover:text-indigo-800 px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-inner transition-all duration-300 min-w-[280px] flex items-center justify-center gap-3"
                  aria-label="Register as a seller for free"
                >
                  Register as Seller — It's Free
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group border-2 border-white/90 text-white hover:bg-white/10 px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 min-w-[280px]"
                  aria-label="Learn how to sell globally"
                >
                  Learn How to Sell Globally
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/90 text-base">
                <div className="flex items-center gap-2.5">
                  <FaLock className="text-xl" aria-hidden="true" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-emerald-300 text-xl" aria-hidden="true" />
                  <span>Verified Businesses Only</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-emerald-300 text-xl" aria-hidden="true" />
                  <span>No Hidden Fees</span>
                </div>
              </div>

              <p className="mt-12 text-white/90 text-lg font-medium">
                Already trusted by <span className="font-bold text-white">8,500+</span> manufacturers and exporters worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default PromoCard;