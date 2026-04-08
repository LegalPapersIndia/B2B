// src/Pages/AboutUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaUsers, FaAward, FaChartLine } from 'react-icons/fa';

// Sample data - replace with real if needed
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
  image: 'https://images.unsplash.com/photo-1560250097-0b93528b5b59?auto=format&fit=crop&q=80', // Professional CEO image
  message: 'At B2B Portal, we believe in breaking barriers and building bridges in global trade. From our humble beginnings in Delhi, we\'ve grown into a trusted platform that connects ambitious businesses worldwide. Our commitment to verification, transparency, and innovation ensures that every transaction is secure and every partnership is fruitful. As we continue our journey, we\'re excited to empower more entrepreneurs to go global. Together, let\'s shape the future of B2B commerce.',
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
      <section className="relative bg-gradient-to-r from-indigo-900 to-emerald-900 text-white py-24 lg:py-32 overflow-hidden">
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
                B2B Portal was founded in 2018 in Delhi, India, with a simple yet powerful mission: to bridge the gap between suppliers and buyers in the global marketplace. Starting as a small team passionate about international trade, we've grown into a leading B2B platform serving thousands of businesses worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Specializing in categories like Medicine, Food, Cosmetics, Beverages, and more, we provide verified connections, secure transactions, and tools to help businesses expand globally.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
                <StatCard icon={<FaGlobe />} value={companyData.countries} label="Countries Served" />
                <StatCard icon={<FaUsers />} value={companyData.suppliers} label="Verified Suppliers" />
                <StatCard icon={<FaChartLine />} value={companyData.buyers} label="Active Buyers" />
                <StatCard icon={<FaAward />} value="5+" label="Industry Awards" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl p-8 lg:p-12">
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
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 lg:left-1/2 h-full w-0.5 bg-emerald-200 transform lg:-translate-x-1/2" />
            
            <div className="space-y-12 lg:space-y-0">
              {journeyTimeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col lg:flex-row ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} items-center lg:items-start gap-6 lg:gap-12`}
                >
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16 lg:flex lg:flex-row-reverse'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-2xl font-bold text-emerald-600 mb-2">{item.year}</h3>
                      <p className="text-gray-700">{item.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 lg:left-1/2 transform -translate-x-1/2 lg:translate-x-0 w-4 h-4 bg-emerald-500 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">Message from Our CEO</h2>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <img src={ceoMessage.image} alt={ceoMessage.name} className="rounded-3xl shadow-xl w-full h-auto object-cover" />
            </div>
            <div className="lg:col-span-2">
              <blockquote className="text-xl lg:text-2xl text-gray-700 italic leading-relaxed mb-8">
                "{ceoMessage.message}"
              </blockquote>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-xl">{ceoMessage.name}</p>
                <p className="text-gray-600">{ceoMessage.position}, B2B Portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-white">
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
                className="bg-gray-50 rounded-2xl p-6 shadow-md border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaAward key={i} className={i < Math.floor(testimonial.rating) ? "text-amber-500" : "text-gray-300"} />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">"{testimonial.quote}"</blockquote>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-600 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Join the B2B Revolution</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Become part of our growing community and take your business global today.</p>
          <button className="bg-white text-emerald-600 px-10 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

// Helper Component
const StatCard = ({ icon, value, label }) => (
  <div className="text-center p-4 bg-gray-50 rounded-xl shadow-sm">
    <div className="text-4xl text-emerald-600 mb-2 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

export default AboutUs;