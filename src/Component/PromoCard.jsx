// src/Component/PromoCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
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
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-indigo-50/70 via-white to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Register Your Business Today
          </h2>
          <p className="mt-5 text-xl sm:text-2xl text-gray-700 font-light max-w-4xl mx-auto">
            Expand Globally • Reach Thousands of Serious Buyers • Grow Without Limits
          </p>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of manufacturers, exporters and suppliers already succeeding on the fastest-growing B2B marketplace.
          </p>
        </motion.div>

        {/* Benefits */}
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
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-7 lg:p-9 shadow-lg border border-gray-100/80 hover:shadow-2xl hover:border-indigo-200/60 transition-all duration-400 hover:-translate-y-2 group"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-400 ease-out">
                {benefit.icon}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA Card – glassmorphism style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)',
          }}
        >
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,white_1px,transparent_1px)] bg-[length:40px_40px]" />
          </div>

          <div className="relative z-10 py-16 lg:py-20 px-6 sm:px-10 lg:px-16 text-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
              Ready to Take Your Business Global?
            </h3>

            <p className="text-xl lg:text-2xl text-indigo-100/95 mb-10 max-w-3xl mx-auto font-light">
              Free registration • Zero setup fees • Start receiving serious buyer inquiries within hours
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8 mb-10">
              <button className="group relative bg-white text-indigo-700 hover:text-indigo-800 px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.04] active:scale-98 min-w-[260px]">
                <span className="flex items-center justify-center gap-3">
                  Register as Seller — It's Free
                </span>
              </button>

              <button className="group relative border-2 border-white/90 text-white hover:bg-white/10 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-[1.04] active:scale-98 min-w-[260px]">
                Learn How to Sell Globally
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <FaLock className="text-lg" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-300 text-lg" />
                <span>Verified Businesses Only</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-300 text-lg" />
                <span>No Hidden Fees</span>
              </div>
            </div>

            <p className="mt-10 text-indigo-100/90 text-lg font-medium">
              Already trusted by <span className="font-bold">8,500+</span> manufacturers and exporters worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoCard;