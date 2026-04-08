// Optimized Manufacturing Hubs Carousel (Clean + Balanced UI)
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Reduced & focused data
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
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true }}
          loop
        >
          {manufacturingHubs.map((hub, i) => (
            <SwiperSlide key={i}>

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >

                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={`${hub.image}?auto=format&fit=crop&w=600&q=80`}
                    alt={hub.city}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5">

                  {/* City + Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {hub.city}
                    </div>
                    <div className="flex items-center text-sm text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {hub.rating}
                    </div>
                  </div>

                  {/* Suppliers */}
                  <p className="text-sm text-gray-600 mb-3">
                    {hub.suppliers} Suppliers Available
                  </p>

                  {/* Industries */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hub.industries.map((item, j) => (
                      <span
                        key={j}
                        className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>

              </motion.div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
