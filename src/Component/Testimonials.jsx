// src/Component/Testimonials.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Correct imports for Swiper v11+
import 'swiper/css';                    // base styles
import 'swiper/css/navigation';         // ← still works in many setups
import 'swiper/css/pagination';

// Sample testimonials data
const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Import Manager, Global Traders Pvt Ltd",
    quote: "Posted my requirement for bulk spices and received 8 competitive quotes within 48 hours. Saved 18% on my order — this platform is a game-changer for importers!",
    imageId: 1,
    rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "Procurement Head, MediCare Solutions",
    quote: "As a buyer in pharmaceuticals, trust is everything. Verified suppliers and secure process gave me peace of mind. Found reliable APIs at better prices than my old network.",
    imageId: 10,
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Export Director, SteelTech Industries",
    quote: "Registered as a seller and started getting international inquiries in the first week. Closed 3 big deals in a month — highly recommend for manufacturers looking to go global.",
    imageId: 0,
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Supply Chain Manager, US Importers Inc.",
    quote: "Easy to post requirements and compare quotes side-by-side. The verified badge system builds instant trust — we've sourced cosmetics and food items successfully multiple times.",
    imageId: 6,
    rating: 4.5,
  },
  {
    name: "Vikram Singh",
    role: "CEO, AgroExport India",
    quote: "From posting MOQ details to finalizing deals, everything is seamless. Gained buyers from Middle East and Europe — best decision for our export business this year.",
    imageId: 3,
    rating: 5,
  },
  {
    name: "Elena Rossi",
    role: "Purchasing Lead, EuroBeauty Distributors",
    quote: "Love the transparency and speed. Posted for organic skincare and got quality suppliers quickly. Will keep using for all our sourcing needs.",
    imageId: 11,
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            What Our Users Say
          </h2>
          <p className="mt-5 text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-light">
            Real stories from buyers and sellers who are growing with us
          </p>
        </motion.div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="!pb-14" // padding for pagination dots
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-3 h-full flex flex-col"
              >
                {/* Avatar + Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-100 shadow-md flex-shrink-0 bg-gray-200">
                    {/* Dynamic image rendering - replace with your actual image logic */}
                    {/* For now placeholder - in production use <img src={`...${testimonial.imageId}`} alt={testimonial.name} className="w-full h-full object-cover" /> */}
                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-emerald-400 flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(testimonial.rating)
                              ? "text-amber-500"
                              : i < testimonial.rating
                              ? "text-amber-500/50"
                              : "text-gray-300"
                          }
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 italic text-base leading-relaxed flex-1">
                  "{testimonial.quote}"
                </blockquote>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows (optional - Swiper has built-in but we can style them) */}
        <div className="swiper-button-prev !left-0 !text-indigo-600 hover:!text-indigo-800 transition-colors" />
        <div className="swiper-button-next !right-0 !text-indigo-600 hover:!text-indigo-800 transition-colors" />

        <div className="text-center mt-10">
          <p className="text-lg text-gray-600">
            Join <span className="font-semibold text-indigo-700">10,000+</span> happy businesses already trading smarter
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;