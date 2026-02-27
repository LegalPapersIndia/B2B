// src/Component/HeroCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    id: 1,
    bgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2070",
    title: "Source Premium Products Worldwide",
    subtitle: "Connect directly with verified global suppliers • Competitive pricing • Fast sourcing",
    accent: "text-emerald-400"
  },
  {
    id: 2,
    bgImage: "https://images.unsplash.com/photo-1556740714-a8395b3a74dd?auto=format&fit=crop&q=80&w=2070",
    title: "Grow Your Business Globally",
    subtitle: "Reach thousands of serious buyers • Showcase products • Expand market reach effortlessly",
    accent: "text-blue-400"
  },
  {
    id: 3,
    bgImage: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=2070",
    title: "Secure & Trusted B2B Platform",
    subtitle: "Verified businesses • Safe transactions • Reliable international trade connections",
    accent: "text-indigo-400"
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback((newDirection) => {
    setPage([page + newDirection, newDirection]);
    setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
  }, [page]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => paginate(1), 7000);
    return () => clearInterval(timer);
  }, [isPaused, paginate]);

  // Animation Variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.4 + i * 0.2, duration: 1, ease: "easeOut" }
    })
  };

  return (
    <section 
      className="relative w-full h-[550px] sm:h-[650px] lg:h-[80vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 280, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 }
          }}
          className="absolute inset-0"
        >
          {/* Background with Ken Burns (subtle zoom) */}
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto text-white">
            <motion.div 
              custom={0} variants={contentVariants} initial="hidden" animate="visible"
              className="inline-block px-5 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
            >
              <span className="text-emerald-300 text-sm sm:text-base font-semibold tracking-wider uppercase">
                Global B2B Marketplace
              </span>
            </motion.div>

            <motion.h1
              custom={1} variants={contentVariants} initial="hidden" animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl"
            >
              {slides[current].title.split(" ").map((word, i) => (
                <span key={i} className={`${i % 2 === 1 ? slides[current].accent : ""}`}>
                  {word}{" "}
                </span>
              ))}
            </motion.h1>

            <motion.p
              custom={2} variants={contentVariants} initial="hidden" animate="visible"
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mb-10 md:mb-12 text-gray-200 font-light leading-relaxed drop-shadow-lg"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.div
              custom={3} variants={contentVariants} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-5 sm:gap-8"
            >
              <button className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.03] active:scale-95 shadow-lg">
                Start Buying
              </button>
              <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-95">
                Register as Seller
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - only one pair, visible on md+ */}
      <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-6 lg:px-12 z-30 pointer-events-none">
        <button
          onClick={() => paginate(-1)}
          className="pointer-events-auto p-5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-black/50 hover:scale-110 transition-all duration-300 shadow-2xl group"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={28} className="group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => paginate(1)}
          className="pointer-events-auto p-5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-black/50 hover:scale-110 transition-all duration-300 shadow-2xl group"
          aria-label="Next slide"
        >
          <FaChevronRight size={28} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Modern Dots (bottom center) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setPage([index, index > current ? 1 : -1]);
              setCurrent(index);
            }}
            className={`h-3 rounded-full transition-all duration-500 ${
              current === index 
                ? "w-12 bg-emerald-500 shadow-lg shadow-emerald-500/40" 
                : "w-3 bg-white/40 hover:bg-white hover:w-6"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-40">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, ease: "linear" }}
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
        />
      </div>
    </section>
  );
};

export default HeroCarousel;