// src/Component/Testimonials.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Import Manager, Global Traders Pvt Ltd",
    quote: "Posted my requirement for bulk spices and received 8 competitive quotes within 48 hours. Saved 18% on my order — this platform is a game-changer for importers!",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "Procurement Head, MediCare Solutions",
    quote: "As a buyer in pharmaceuticals, trust is everything. Verified suppliers and secure process gave me peace of mind. Found reliable APIs at better prices than my old network.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Export Director, SteelTech Industries",
    quote: "Registered as a seller and started getting international inquiries in the first week. Closed 3 big deals in a month — highly recommend for manufacturers looking to go global.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Supply Chain Manager, US Importers Inc.",
    quote: "Easy to post requirements and compare quotes side-by-side. The verified badge system builds instant trust.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "CEO, AgroExport India",
    quote: "From posting MOQ details to finalizing deals, everything is seamless. Gained buyers from Middle East and Europe — best decision for our export business this year.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Trusted by Real Businesses
            </h2>
            <p className="mt-5 text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it — hear from buyers and sellers who are successfully trading on our platform.
            </p>
          </motion.div>
        </div>

        {/* Swiper - Only Autoplay, No Navigation, No Pagination */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false 
          }}
          loop={true}
          className="pb-8"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
              >
                {/* Quote Icon */}
                <div className="text-emerald-500 mb-6">
                  <FaQuoteLeft size={42} />
                </div>

                {/* Quote Text */}
                <blockquote className="text-gray-700 text-lg leading-relaxed flex-1">
                  "{testimonial.quote}"
                </blockquote>

                {/* Rating Stars */}
                <div className="flex gap-1 my-6 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={20} className="fill-current" />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-auto">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Trust Line */}
        <div className="text-center mt-14">
          <p className="text-lg text-gray-600">
            Join over <span className="font-bold text-emerald-700">10,000+</span> businesses 
            transforming their trade experience
          </p>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;