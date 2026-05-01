// src/Component/HeroCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    bgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2070",
    title: "Source Premium Products",
    subtitle: "Connect directly with verified global suppliers • Competitive pricing • Fast sourcing",
    accent: "text-orange-400"
  },
  {
    id: 2,
    bgImage: "https://www.seebiz.com/blog/wp-content/webpc-passthru.php?src=https://www.seebiz.com/blog/wp-content/uploads/2024/05/b2b.png&nocache=1",
    title: "Grow Business Globally",
    subtitle: "Reach thousands of serious buyers • Showcase products • Expand market reach effortlessly",
    accent: "text-blue-400"
  },
  {
    id: 3,
    bgImage: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=2070",
    title: "Secure B2B Platform",
    subtitle: "Verified businesses • Safe transactions • Reliable international trade connections",
    accent: "text-orange-400"
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

    const timer = setInterval(() => {
      paginate(1);
    }, 4000); // Increased to 4 seconds for better readability

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
      transition: { delay: 0.2 + i * 0.2, duration: 0.9, ease: "easeOut" }
    })
  };

  return (
    <section
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[78vh] overflow-hidden bg-black rounded-b-3xl shadow-2xl"
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
          {/* Background with Ken Burns effect */}
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto text-white">
            
            {/* Badge */}
            <motion.div
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="inline-block px-6 py-2.5 mb-6 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
            >
              <span className="text-orange-300 text-sm sm:text-base font-semibold tracking-widest uppercase">
                GLOBAL B2B MARKETPLACE
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl"
            >
              {slides[current].title.split(" ").map((word, i) => (
                <span 
                  key={i} 
                  className={i % 2 === 1 ? slides[current].accent : "text-white"}
                >
                  {word}{" "}
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mb-10 md:mb-12 text-gray-200 font-light leading-relaxed drop-shadow-lg"
            >
              {slides[current].subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-5 sm:gap-6"
            >
              <Link
                to="/signup?role=buyer"
                className="px-10 py-5 bg-orange-600 hover:bg-orange-700 
                           text-white rounded-2xl font-bold text-lg transition-all duration-300 
                           hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-[1.03] 
                           active:scale-95 shadow-lg text-center"
              >
                Start Buying
              </Link>

              <Link
                to="/signup?role=seller"
                className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white 
                           border border-white/30 backdrop-blur-md rounded-2xl 
                           font-bold text-lg transition-all duration-300 
                           hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] 
                           hover:scale-[1.03] active:scale-95 text-center"
              >
                Register as Seller
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Optional Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const dir = index > current ? 1 : -1;
              setPage([index, dir]);
              setCurrent(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current 
                ? "bg-orange-500 scale-125" 
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;