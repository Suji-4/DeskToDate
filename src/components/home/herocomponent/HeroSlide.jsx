// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";

// import car1 from "../../../assets/images/car1.avif";
// import car2 from "../../../assets/images/car2.avif";
// import car3 from "../../../assets/images/car3.avif";

// // =====================================================
// // HERO IMAGES
// // =====================================================

// const images = [car1, car2, car3];

// // =====================================================
// // HERO SLIDE COMPONENT
// // =====================================================

// const HeroSlide = () => {
//   const [currentImage, setCurrentImage] = useState(0);

//   // ===================================================
//   // AUTO SLIDER
//   // ===================================================

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   // ===================================================
//   // JSX
//   // ===================================================

//   return (
//     <section className="w-full overflow-hidden">
//       <div className="relative min-h-[430px] w-full bg-gradient-to-r from-[#1E293B] to-[#134E4A] sm:min-h-[500px] lg:min-h-[680px]">

//         {/* ==========================================
//             MAIN CONTAINER
//         ========================================== */}

//         <div className="mx-auto grid min-h-[430px] max-w-[1500px] grid-cols-1 items-center px-4 pb-8 pt-18 sm:min-h-[500px] sm:px-6 sm:pb-10 sm:pt-24 md:px-8 lg:min-h-[680px] lg:grid-cols-2 lg:px-16 lg:pb-16 lg:pt-24 xl:px-20">

//           {/* ========================================
//               LEFT CONTENT
//           ======================================== */}

//           <div className="relative z-20 flex flex-col justify-center lg:pl-8 xl:pl-12">

//             {/* SMALL HEADING */}

//             <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
//               <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-teal-400 sm:mb-4 sm:text-sm">
//                 Discover D2D
//               </p>

//               {/* MAIN HEADING */}

//               <h1 className="max-w-[650px] text-[32px] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[68px]">
//                 Something
//                 <span className="block text-teal-400">
//                   Fun For Everyone
//                 </span>
//                 Starts Here
//               </h1>

//               {/* DESCRIPTION */}

//               <p className="mt-4 max-w-[470px] text-sm leading-6 text-slate-300 sm:mt-6 sm:text-base sm:leading-7">
//                 Explore a collection of thoughtfully chosen products designed
//                 to add more fun, style and convenience to everyday life.
//               </p>
//             </motion.div>

//             {/* ========================================
//                 EXPLORE BUTTON
//             ======================================== */}

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-6 sm:mt-8">
//               <Link to="/products" className="inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 sm:px-7 sm:py-3.5 sm:text-sm">
//                 Explore Products
//               </Link>
//             </motion.div>

//             {/* ========================================
//                 SLIDER INDICATORS
//             ======================================== */}

//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-7 hidden items-center gap-2 lg:flex">
//               {images.map((_, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => setCurrentImage(index)}
//                   aria-label={`Show image ${index + 1}`}
//                   className={`h-1.5 rounded-full transition-all duration-500 ${currentImage === index ? "w-8 bg-teal-400" : "w-2 bg-white/40"}`}
//                 />
//               ))}
//             </motion.div>
//           </div>

//           {/* ========================================
//               RIGHT IMAGE
//           ======================================== */}

//           <div className="relative mt-10 hidden w-full items-center justify-center lg:mt-0 lg:flex lg:justify-center">

//             <div className="relative aspect-[16/10] w-full max-w-[350px] overflow-hidden rounded-xl sm:max-w-[430px] sm:rounded-2xl md:max-w-[500px] lg:ml-[-20px] lg:max-w-[520px] xl:max-w-[570px]">

//               {/* ======================================
//                   IMAGE ANIMATION
//               ====================================== */}

//               <AnimatePresence mode="wait">
//                 <motion.img
//                   key={currentImage}
//                   src={images[currentImage]}
//                   alt={`D2D car toy ${currentImage + 1}`}
//                   initial={{ opacity: 0, x: 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -50 }}
//                   transition={{ duration: 0.8, ease: "easeInOut" }}
//                   className="absolute inset-0 h-full w-full object-cover"
//                 />
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSlide;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import toys from "../../../assets/images/h1.png";
import remoteCars from "../../../assets/images/cars8.png";
import boardGames from "../../../assets/images/board2.png";
import Toys from "../../../assets/images/toys5.png";
import toy from "../../../assets/images/toy.png";

const slides = [
  { image: toys, category: "TOYS" },
  { image: remoteCars, category: "REMOTE CARS" },
  { image: boardGames, category: "BOARD GAMES" },
  { image: Toys, category: "Toys" },
  { image: toy, category: "TOYS" },
];

const HeroSlide = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[current];

  const imageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.97,
    }),

    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },

    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: "easeIn",
      },
    }),
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#003E43] text-white">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(0,210,190,0.18),transparent_30%),linear-gradient(115deg,#062B3A_0%,#003D43_48%,#00605A_100%)]" />

      <div className="pointer-events-none absolute -right-[10%] -top-[20%] h-[500px] w-[500px] rounded-full border-[65px] border-[#16BDB2]/10" />

      <div className="pointer-events-none absolute -left-[15%] bottom-[5%] h-[350px] w-[650px] rotate-[-25deg] rounded-full border-[60px] border-[#16BDB2]/10" />

      <div className="pointer-events-none absolute left-[5%] top-[31%] h-2 w-2 rounded-full bg-[#35D8C5]" />

      <div className="pointer-events-none absolute right-[10%] top-[18%] h-3 w-3 rounded-full bg-[#35D8C5]" />

      {/* MAIN CONTENT
          Extra top space is added so content never goes behind navbar.
      */}
      <div
        className="
          relative z-10 mx-auto flex w-full max-w-[1700px]
          flex-col
          px-4

          pt-[150px]
          pb-[190px]

          sm:px-6
          sm:pt-[150px]
          sm:pb-[190px]

          md:px-10
          md:pt-[155px]

          lg:h-[calc(100vh-170px)]
          lg:flex-row
          lg:items-center
          lg:px-14
          lg:pt-[125px]
          lg:pb-0

          xl:px-20
          xl:pt-[125px]

          2xl:px-24
          2xl:pt-[120px]
        "
      >

        {/* LEFT CONTENT */}
        <div
          className="
            relative z-40
            w-full
            max-w-[760px]
            lg:w-[52%]
          "
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="
              text-[2.6rem]
              font-black
              leading-[0.94]
              tracking-tight

              sm:text-[3.2rem]
              md:text-[4rem]
              lg:text-[4.8rem]
              xl:text-[5.7rem]
              2xl:text-[6.5rem]
            "
          >
            Fun & Creative
            <br />
            <span>Toys</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 70 }}
            transition={{ duration: 0.45 }}
            className="mt-5 h-[3px] rounded-full bg-[#35D8C5]"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="
              mt-5
              max-w-[560px]
              text-sm
              font-medium
              leading-6
              text-white/85

              sm:text-base
              sm:leading-7

              md:text-lg

              lg:max-w-[620px]
              lg:text-xl
              lg:leading-8
            "
          >
            Bring home joy, imagination and endless fun with our
            handpicked toys for every age.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="
              mt-4
              max-w-[620px]
              text-xs
              leading-5
              text-white/60

              sm:text-sm
              sm:leading-6

              md:text-base
              md:leading-7

              lg:max-w-[680px]
              lg:text-[17px]
              lg:leading-7
            "
          >
            Discover colorful toys, creative playsets and exciting
            favorites carefully selected to make every playtime more
            enjoyable. From learning through play to creating wonderful
            memories, there is something special for every little explorer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-2
              text-[9px]
              font-bold
              tracking-wide
              text-white/80

              sm:gap-3
              sm:text-[10px]

              md:gap-4
              md:text-xs

              lg:gap-5
              lg:text-sm
            "
          >
            <span>Creative Play</span>
            <span className="text-[#35D8C5]">•</span>
            <span>Happy Moments</span>
            <span className="text-[#35D8C5]">•</span>
            <span>Endless Imagination</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="relative z-[100] mt-6"
          >
            <Link
              to="/products"
              className="
                group
                inline-flex
                min-h-[44px]
                items-center
                gap-3
                rounded-full
                bg-[#35D8C5]
                px-5
                py-2.5
                text-xs
                font-extrabold
                text-[#003E43]
                shadow-[0_12px_30px_rgba(0,0,0,0.2)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white

                sm:min-h-[48px]
                sm:px-6
                sm:text-sm

                md:min-h-[52px]
                md:gap-4
                md:px-7
              "
            >
              <span>Shop Now</span>

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[#003E43]
                  text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-1

                  md:h-8
                  md:w-8
                "
              >
                <FaArrowRight className="text-[10px] md:text-xs" />
              </span>
            </Link>
          </motion.div>

          <div className="mt-5 flex items-center gap-3 md:mt-6 md:gap-4">
            <span className="text-lg font-black text-[#35D8C5] md:text-xl">
              0{current + 1}
            </span>

            <div className="h-[2px] w-14 overflow-hidden rounded-full bg-white/20 md:w-20">
              <motion.div
                key={current}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.8, ease: "linear" }}
                className="h-full bg-[#35D8C5]"
              />
            </div>

            <span className="text-[9px] font-bold tracking-widest text-white/50 md:text-xs">
              05
            </span>
          </div>
        </div>

        {/* DESKTOP IMAGE */}
        <div
          className="
            relative
            z-30
            hidden
            w-[48%]
            items-center
            justify-end

            lg:flex
            lg:h-[400px]
            xl:h-[440px]
            2xl:h-[470px]
          "
        >
          <motion.div
            key={`glow-${current}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="
              pointer-events-none
              absolute
              right-[12%]
              top-[28%]
              h-[280px]
              w-[280px]
              rounded-full
              bg-[#35D8C5]/10
              blur-[80px]
            "
          />

          <div className="relative flex h-full w-full items-center justify-end overflow-visible">
            <AnimatePresence
              custom={direction}
              initial={false}
              mode="popLayout"
            >
              <motion.div
                key={activeSlide.category}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-center justify-end overflow-visible"
              >
                <img
                  src={activeSlide.image}
                  alt={activeSlide.category}
                  draggable="false"
                  className="
                    block
                    h-auto
                    w-auto
                    max-h-[390px]
                    max-w-[95%]
                    object-contain
                    object-right
                    drop-shadow-[0_25px_35px_rgba(0,0,0,0.28)]

                    xl:max-h-[430px]
                    2xl:max-h-[455px]
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 right-0 z-[100] flex gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full border border-white/20 bg-white/10
                backdrop-blur-md transition
                hover:border-[#35D8C5]
                hover:bg-[#35D8C5]
                hover:text-[#003E43]
              "
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full border border-white/20 bg-white/10
                backdrop-blur-md transition
                hover:border-[#35D8C5]
                hover:bg-[#35D8C5]
                hover:text-[#003E43]
              "
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* MOBILE IMAGE */}
        <div
          className="
            relative
            z-30
            mt-6
            flex
            h-[180px]
            w-full
            items-center
            justify-center

            sm:h-[210px]
            md:h-[240px]

            lg:hidden
          "
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#35D8C5]/10 blur-[55px]" />

          <div className="relative flex h-full w-full items-center justify-center overflow-visible">
            <AnimatePresence
              custom={direction}
              initial={false}
              mode="popLayout"
            >
              <motion.div
                key={`mobile-${activeSlide.category}`}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center overflow-visible"
              >
                <img
                  src={activeSlide.image}
                  alt={activeSlide.category}
                  draggable="false"
                  className="
                    block
                    h-auto
                    w-auto
                    max-h-[175px]
                    max-w-[92%]
                    object-contain
                    object-center

                    sm:max-h-[200px]
                    md:max-h-[225px]
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-[-5px] right-0 z-[100] flex gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition hover:border-[#35D8C5] hover:bg-[#35D8C5] hover:text-[#003E43]"
            >
              <FaChevronLeft className="text-[9px]" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition hover:border-[#35D8C5] hover:bg-[#35D8C5] hover:text-[#003E43]"
            >
              <FaChevronRight className="text-[9px]" />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="absolute bottom-0 left-0 z-[70] h-[170px] w-full border-t border-white/10 bg-[#063F43]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1700px] items-center justify-between gap-3 px-3 py-4 sm:gap-4 sm:px-6 md:gap-5 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
          {slides.map((slide, index) => {
            const isActive = current === index;

            return (
              <motion.button
                key={slide.category}
                type="button"
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                whileHover={{ y: -5, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative
                  flex
                  h-[138px]
                  min-w-0
                  flex-1
                  items-center
                  overflow-hidden
                  rounded-xl
                  border
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "border-[#35D8C5] bg-[#12575A] shadow-[0_0_25px_rgba(53,216,197,0.22)]"
                      : "border-white/10 bg-[#0A494C]/80 hover:border-[#35D8C5]/40"
                  }
                `}
              >
                <div className="flex h-full w-[68%] items-center justify-center px-2 py-2 sm:px-3">
                  <motion.img
                    src={slide.image}
                    alt={slide.category}
                    animate={
                      isActive
                        ? {
                            scale: [0.9, 1.03, 1],
                            opacity: [0.5, 1, 1],
                          }
                        : {
                            scale: 1,
                            opacity: 0.72,
                          }
                    }
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="block h-full w-full object-contain object-center"
                    draggable="false"
                  />
                </div>

                <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 px-1 sm:gap-3 sm:px-2">
                  <span
                    className={`text-center text-[7px] font-extrabold tracking-[0.05em] sm:text-[8px] md:text-[10px] ${
                      isActive ? "text-white" : "text-white/60"
                    }`}
                  >
                    {slide.category}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[7px] sm:h-7 sm:w-7 sm:text-[8px] ${
                      isActive
                        ? "border-[#35D8C5]/60 bg-[#35D8C5]/15 text-[#35D8C5]"
                        : "border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    <FaArrowRight />
                  </span>
                </div>

                <motion.div
                  animate={{
                    width: isActive ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-[3px] bg-[#35D8C5]"
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSlide;