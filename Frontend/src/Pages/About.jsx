// src/Pages/AboutUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaUsers, FaAward, FaChartLine } from 'react-icons/fa';

const companyData = {
  founded: 2018,
  employees: '200+',
  countries: '50+',
  suppliers: '10,000+',
  buyers: '50,000+',
  mission: 'To revolutionize global B2B trade by connecting verified suppliers and buyers seamlessly, fostering trust, efficiency, and growth.',
  vision: 'To be the world\'s leading B2B marketplace, empowering businesses of all sizes to thrive in the international economy.',
};

const journeyTimeline = [
  { year: 2018, event: 'Founded in Delhi, India, with a vision to simplify B2B sourcing for Indian exporters.' },
  { year: 2019, event: 'Launched MVP platform with core categories: Medicine, Food, and Cosmetics.' },
  { year: 2020, event: 'Expanded to 10+ categories amid global pandemic, focusing on essential goods supply chains.' },
  { year: 2021, event: 'Integrated AI-powered matching and verification system; reached 1,000 verified suppliers.' },
  { year: 2022, event: 'International expansion: Added global buyers from 20+ countries; secured Series A funding.' },
  { year: 2023, event: 'Launched mobile app and advanced analytics dashboard; crossed 5,000 active users.' },
  { year: 2024, event: 'Introduced secure payment gateway and logistics partnerships; expanded to 50+ countries.' },
  { year: 2025, event: 'Achieved 10,000+ suppliers milestone; won "Best B2B Platform" award at India Trade Expo.' },
  { year: 2026, event: 'Current: Serving 50,000+ buyers worldwide, with focus on sustainable trade practices.' },
];

const ceoMessage = {
  name: 'Rahul Gupta',
  position: 'Founder & CEO',
  image: 'https://images.unsplash.com/photo-1560250097-0b93528b5b59?auto=format&fit=crop&q=80',
  message: 'At B2B Portal, we believe in breaking barriers and building bridges in global trade. From our humble beginnings in Delhi, we\'ve grown into a trusted platform that connects ambitious businesses worldwide. Our commitment to verification, transparency, and innovation ensures that every transaction is secure and every partnership is fruitful.',
};

const testimonials = [
  { name: 'Amit Patel', role: 'Export Director, SteelTech Industries', quote: 'B2B Portal transformed our export business - we closed deals in 3 new countries within months!', rating: 5 },
  { name: 'Priya Mehta', role: 'Procurement Head, MediCare Solutions', quote: 'The verification process gives us confidence in every supplier. Best platform for sourcing pharma products.', rating: 5 },
  { name: 'Sarah Johnson', role: 'Supply Chain Manager, US Importers Inc.', quote: 'Seamless experience from inquiry to delivery. Highly recommend for international trade.', rating: 4.5 },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-orange-700 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            About B2B Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl max-w-3xl mx-auto font-light"
          >
            Empowering global trade through innovation, trust, and seamless connections.
          </motion.p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                B2B Portal was founded in 2018 in Delhi, India, with a simple yet powerful mission: to bridge the gap between suppliers and buyers in the global marketplace.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Starting as a small team passionate about international trade, we've grown into a leading B2B platform serving thousands of businesses worldwide.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10">
                <StatCard icon={<FaGlobe />} value={companyData.countries} label="Countries Served" />
                <StatCard icon={<FaUsers />} value={companyData.suppliers} label="Verified Suppliers" />
                <StatCard icon={<FaChartLine />} value={companyData.buyers} label="Active Buyers" />
                <StatCard icon={<FaAward />} value="5+" label="Industry Awards" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-8">{companyData.mission}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">{companyData.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">Our Journey</h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-6 lg:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-orange-400 to-blue-500" />

            <div className="space-y-12 lg:space-y-16">
              {journeyTimeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="relative flex flex-col lg:flex-row items-start gap-8 lg:gap-12"
                >
                  {/* Year */}
                  <div className="lg:w-28 flex-shrink-0">
                    <div className="bg-white border-2 border-orange-500 text-orange-600 font-bold text-2xl w-14 h-14 rounded-2xl flex items-center justify-center shadow-md z-10">
                      {item.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{item.event}</p>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 lg:left-1/2 w-5 h-5 bg-white border-4 border-orange-500 rounded-full -translate-x-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">Message from Our CEO</h2>
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <img 
                src={ceoMessage.image} 
                alt={ceoMessage.name} 
                className="rounded-3xl shadow-2xl w-full h-auto object-cover aspect-[4/3]" 
              />
            </div>
            <div className="lg:col-span-7">
              <blockquote className="text-2xl text-gray-700 leading-relaxed italic mb-10">
                "{ceoMessage.message}"
              </blockquote>
              <div>
                <p className="font-bold text-2xl text-gray-900">{ceoMessage.name}</p>
                <p className="text-orange-600 font-medium">{ceoMessage.position}, B2B Portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">What Our Partners Say</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FaAward 
                      key={i} 
                      className={`text-xl ${i < Math.floor(testimonial.rating) ? "text-orange-500" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Join the B2B Revolution</h2>
          <p className="text-xl mb-10">Become part of our growing community and take your business to the global stage.</p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-orange-600 px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Now — It's Free
          </motion.button>
        </div>
      </section>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label }) => (
  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
    <div className="text-4xl text-orange-600 mb-3 flex justify-center">{icon}</div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
  </div>
);

export default AboutUs;