// src/Component/ManufacturingHubsCarousel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Manufacturing Hubs Data
const manufacturingHubs = [
  {
    city: "Delhi NCR",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerctKvadf3GDTcro3dMVvI7kydCgZjHFLmgUbKU5WYp-JuRcGeABz-T0-GNfm1jyUCzDn40ZQv1vGJL0PQiudTgtwLyVbvi9sxkEnKVdmEI0JD12YjFnLYZN4KNt68M0yWCmhxFWvPQnLQ=s1360-w1360-h1020-rw",
    suppliers: "2.4K+",
    industries: ["Electronics", "Auto", "Apparel"],
    rating: 4.8
  },
  {
    city: "Mumbai",
    image: "https://lh3.googleusercontent.com/gpms-cs-s/AFfmt2Z7m9Z5wzSMcCLOjzrZvGx86WSJ20lbO07tu4ZG3VSe4UbXq0hVoQz5sHbrlagAxYxnauKZmXUjbeZjiMNZ7sOwfKItqV6MYK2HJLW2ppuCeGjGKCssgevT-0DXYjyuztm83cSL=w400-h300-n-k-no",
    suppliers: "3.8K+",
    industries: ["Pharma", "Textiles", "Packaging"],
    rating: 4.9
  },
  {
    city: "Ahmedabad",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqFpK3gyZZkkkcFEyv4fSZjfjDY3CLMp0GfMLJATRYMhFQHm0o_uhUHZ7wT4QuOycwvZzOpC3R2bqR1HxKBK_TL4eDUB-zDIE9xw-n_bbtF7ZRnTkTuZk3Uy85V8imqFQ6fTAe0HA=s1360-w1360-h1020-rw",
    suppliers: "5.1K+",
    industries: ["Textiles", "Chemicals", "Machinery"],
    rating: 4.7
  },
  {
    city: "Bengaluru",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqFe3dP5UZzMMRyXI4mL3WX7lU2oITeR2JoI6LjLs4t3e8vx4Ivb6s3_62x193dVvrLRPAjxpcCK428zX9HaWlYxK-EV7uam0eaxVVHLO-8t2CN7ku14vE_3371aTzlgtfctuVL7ebTbw=s1360-w1360-h1020-rw",
    suppliers: "2.9K+",
    industries: ["Electronics", "Aerospace", "IT"],
    rating: 4.8
  },
  {
    city: "Surat",
    image: "https://lh3.googleusercontent.com/gpms-cs-s/AFfmt2YdVrYRHJNWXRoY_Fk-8YjMMFNF6NH6q_7jt-eOW4EpQ77Vom_STe_C6qjKPB9AFBBZNosGvA-8QlbW7o24fRzlpbb84tEWVazv8ZNaXrX0zYt5Zm_FZZC4ltsQq29zdvTvHJnw=w533-h300-n-k-no",
    suppliers: "6.7K+",
    industries: ["Textiles", "Diamonds", "Apparel"],
    rating: 4.9
  }
];

export default function ManufacturingHubsCarousel() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Manufacturing Hubs
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Explore top industrial cities with verified suppliers across India
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.swiper-pagination' }}
          loop
          className="pb-12"
        >
          {manufacturingHubs.map((hub, i) => (
            <SwiperSlide key={i}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                {/* Image Section */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={`${hub.image}?auto=format&fit=crop&w=600&q=80`}
                    alt={hub.city}
                    className="w-full h-full object-cover hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    {hub.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* City Name */}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-xl text-gray-900">{hub.city}</h3>
                  </div>

                  {/* Suppliers Count */}
                  <p className="text-gray-600 text-sm mb-4">
                    <span className="font-semibold text-gray-800">{hub.suppliers}</span> Suppliers Available
                  </p>

                  {/* Industries */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hub.industries.map((item, j) => (
                      <span
                        key={j}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Explore Button */}
                  <button className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 
                                     text-white py-3.5 rounded-2xl text-sm font-semibold 
                                     flex items-center justify-center gap-2 transition-all duration-300">
                    Explore Hub
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Container */}
        <div className="swiper-pagination mt-6 flex justify-center gap-2"></div>
      </div>
    </section>
  );
}