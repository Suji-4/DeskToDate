
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaArrowRight,
  FaTruck,
  FaLeaf,
  FaShieldAlt,
  FaHeadset,
  FaTag,
} from "react-icons/fa";

/* =========================================================
   BACKEND
========================================================= */

const API_BASE_URL = "http://localhost:8080";

/* =========================================================
   IMAGE URL
========================================================= */

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/${image}`;
};

/* =========================================================
   ANIMATION
========================================================= */

const easeOutExpo = [0.16, 1, 0.3, 1];

const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },

  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,

    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: easeOutExpo,
    },
  }),
};

/* =========================================================
   TRUST ITEMS
========================================================= */

const trustItems = [
  {
    icon: <FaTruck className="text-emerald-500" />,
    text: "Free Delivery From ₹500",
  },
  {
    icon: <FaLeaf className="text-green-500" />,
    text: "Fresh Products Every Day",
  },
  {
    icon: <FaShieldAlt className="text-blue-500" />,
    text: "Safe Payment With Any Card",
  },
  {
    icon: <FaHeadset className="text-purple-500" />,
    text: "24/7 Support Always For You",
  },
  {
    icon: <FaTag className="text-orange-500" />,
    text: "Low Prices Than Others",
  },
];

/* =========================================================
   HERO STYLE
========================================================= */

const getHeroStyle = (index) => {
  if (index === 0) {
    return {
      bg: "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100",
      accentColor: "text-orange-600",
      badgeBg: "bg-orange-200/70",
    };
  }

  return {
    bg: "bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100",
    accentColor: "text-teal-600",
    badgeBg: "bg-teal-200/70",
  };
};

/* =========================================================
   SIDE CARD STYLE
========================================================= */

const getSideCardStyle = (index) => {
  if (index === 0) {
    return {
      bg: "bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200",
      textColor: "text-sky-800",
      buttonBg: "bg-white",
    };
  }

  return {
    bg: "bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200",
    textColor: "text-amber-800",
    buttonBg: "bg-white",
  };
};

/* =========================================================
   HERO SLIDER
========================================================= */

const HeroSlider = ({ heroSlides }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);

    setCurrent((prev) => {
      return (prev + 1) % heroSlides.length;
    });
  };

  const prev = () => {
    setDirection(-1);

    setCurrent((prev) => {
      return (
        (prev - 1 + heroSlides.length) %
        heroSlides.length
      );
    });
  };

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (current >= heroSlides.length) {
      setCurrent(0);
    }
  }, [heroSlides.length, current]);

  if (heroSlides.length === 0) {
    return null;
  }

  const slide = heroSlides[current];

  const slideStyle = getHeroStyle(current);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,
    },

    exit: (dir) => ({
      x: dir > 0 ? -500 : 500,
      opacity: 0,
    }),
  };

  return (
    <div
      className="
        relative
        w-full
        lg:w-[58%]
        h-[360px]
        sm:h-[400px]
        rounded-[22px]
        overflow-hidden
        shadow-[0_5px_25px_rgba(0,0,0,0.07)]
      "
    >
      <AnimatePresence
        initial={false}
        custom={direction}
        mode="wait"
      >
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.65,
            ease: easeOutExpo,
          }}
          className={`
            absolute
            inset-0
            ${slideStyle.bg}
            flex
          `}
        >
          {/* TEXT */}

          <div
            className="
              relative
              z-20
              w-[55%]
              sm:w-[50%]
              pl-7
              sm:pl-10
              pr-2
              flex
              flex-col
              justify-center
            "
          >
            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.6,
              }}
              className="
                text-[21px]
                sm:text-[26px]
                lg:text-[28px]
                font-extrabold
                text-stone-800
                leading-[1.18]
              "
            >
              {slide.title}

              <br />

              <span className={slideStyle.accentColor}>
                {slide.titleAccent}
              </span>
            </motion.h2>

            {/* DISCOUNT */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.6,
              }}
              className="
                mt-5
                flex
                items-center
                gap-3
                flex-wrap
              "
            >
              <span
                className="
                  text-3xl
                  sm:text-4xl
                  font-black
                  text-stone-800
                "
              >
                {slide.discount}
              </span>

              {slide.badge && (
                <span
                  className={`
                    ${slideStyle.badgeBg}
                    text-stone-800
                    text-[9px]
                    font-black
                    px-3
                    py-2
                    rounded-lg
                    whitespace-pre-line
                    leading-tight
                    flex
                    items-center
                    gap-1.5
                  `}
                >
                  <FaTruck />

                  {slide.badge}
                </span>
              )}
            </motion.div>

            {/* BUTTON */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.45,
                duration: 0.6,
              }}
              className="
                mt-6
                flex
                items-center
                gap-4
              "
            >
              <Link
                to="/products"
                className="
                  px-6
                  py-3
                  bg-white
                  rounded-xl
                  text-sm
                  font-bold
                  text-stone-800
                  shadow-md
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  transition-all
                "
              >
                {slide.cta}
              </Link>

              {slide.note && (
                <p
                  className="
                    hidden
                    sm:block
                    text-[10px]
                    text-stone-500
                    leading-relaxed
                    max-w-[160px]
                  "
                >
                  {slide.note}
                </p>
              )}
            </motion.div>
          </div>

          {/* IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 0.8,
              ease: easeOutExpo,
            }}
            className={`
              absolute
              right-0
              top-0
              bottom-0
              ${
                current === 0
                  ? "w-[62%] sm:w-[60%]"
                  : "w-[55%] sm:w-[52%]"
              }
              flex
              items-end
              justify-end
            `}
          >
            {/* IMAGE BACKGROUND CIRCLE */}

            <div
              className={`
                absolute
                ${
                  current === 0
                    ? "w-[330px] h-[330px] sm:w-[370px] sm:h-[370px]"
                    : "w-[270px] h-[270px]"
                }
                rounded-full
                bg-white/25
                blur-sm
              `}
            />

            {/* BACKEND IMAGE */}

            <img
              src={getImageUrl(slide.image)}
              alt={slide.titleAccent}
              className={`
                relative
                z-10
                ${
                  current === 0
                    ? `
                      w-[390px]
                      h-[390px]
                      sm:w-[480px]
                      sm:h-[480px]
                      lg:w-[560px]
                      lg:h-[560px]
                    `
                    : `
                      w-full
                      h-full
                    `
                }
                object-contain
                object-right-bottom
                ${
                  current === 0
                    ? "p-0"
                    : "p-5"
                }
                drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]
                pointer-events-none
              `}
              onError={(event) => {
                console.error(
                  "Offer image failed:",
                  getImageUrl(slide.image)
                );
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* PREVIOUS BUTTON */}

      {heroSlides.length > 1 && (
        <button
          onClick={prev}
          aria-label="Previous"
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            z-30
            w-10
            h-10
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            shadow-md
            text-stone-500
            hover:text-stone-900
            transition-all
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* NEXT BUTTON */}

      {heroSlides.length > 1 && (
        <button
          onClick={next}
          aria-label="Next"
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            z-30
            w-10
            h-10
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            shadow-md
            text-stone-500
            hover:text-stone-900
            transition-all
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* DOTS */}

      {heroSlides.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            -translate-x-1/2
            z-30
            flex
            gap-2
          "
        >
          {heroSlides.map((slideItem, index) => (
            <button
              key={slideItem.id}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`
                h-2.5
                rounded-full
                transition-all
                ${
                  index === current
                    ? "w-7 bg-stone-800"
                    : "w-2.5 bg-white/70"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   SIDE CARD
========================================================= */

const SideCard = ({ card, index }) => {
  const cardStyle = getSideCardStyle(index);

  return (
    <motion.div
      custom={index + 2}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      whileHover={{
        y: -5,
      }}
      className={`
        relative
        ${cardStyle.bg}
        rounded-[22px]
        overflow-hidden
        w-full
        h-[360px]
        sm:h-[400px]
        shadow-[0_4px_18px_rgba(0,0,0,0.05)]
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)]
        transition-shadow
        duration-500
      `}
    >
      {/* TEXT */}

      <div
        className="
          absolute
          top-0
          left-0
          right-0
          z-20
          p-5
          sm:p-6
        "
      >
        {card.topLabel && (
          <p
            className="
              text-[9px]
              sm:text-[10px]
              font-black
              tracking-[0.12em]
              uppercase
              text-stone-500
              leading-tight
              max-w-[150px]
            "
          >
            {card.topLabel}
          </p>
        )}

        {card.titleAccent && (
          <h3
            className={`
              mt-2
              ${cardStyle.textColor}
              text-xl
              sm:text-2xl
              font-extrabold
              leading-tight
              max-w-[150px]
            `}
          >
            {card.titleAccent}
          </h3>
        )}

        {card.title && (
          <h3
            className={`
              mt-2
              ${cardStyle.textColor}
              text-xl
              sm:text-2xl
              font-extrabold
              leading-tight
              max-w-[150px]
            `}
          >
            {card.title}
          </h3>
        )}
      </div>

      {/* IMAGE */}

      <div
        className="
          absolute
          left-[8%]
          right-[8%]
          top-[30%]
          bottom-[18%]
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        <motion.img
          src={getImageUrl(card.image)}
          alt={card.titleAccent || card.title}
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.25 + index * 0.15,
            duration: 0.7,
            ease: easeOutExpo,
          }}
          className="
            max-w-full
            max-h-full
            w-auto
            h-auto
            object-contain
            drop-shadow-[0_12px_16px_rgba(0,0,0,0.15)]
            transition-transform
            duration-500
            pointer-events-none
          "
          onError={(event) => {
            console.error(
              "Side offer image failed:",
              getImageUrl(card.image)
            );
          }}
        />
      </div>

      {/* BUTTON */}

      <div
        className="
          absolute
          bottom-5
          left-5
          right-5
          z-30
        "
      >
        <Link
          to="/products"
          className={`
            inline-flex
            items-center
            gap-2
            ${cardStyle.buttonBg}
            ${cardStyle.textColor}
            px-4
            py-2.5
            rounded-xl
            text-xs
            sm:text-sm
            font-bold
            shadow-sm
            hover:shadow-md
            hover:-translate-y-0.5
            transition-all
          `}
        >
          {card.cta}

          <FaArrowRight className="text-[9px]" />
        </Link>
      </div>

      {/* DECORATION */}

      <div
        className="
          absolute
          -right-8
          -top-8
          w-28
          h-28
          rounded-full
          border-[9px]
          border-white/20
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -right-5
          -bottom-5
          w-20
          h-20
          rounded-full
          border-[7px]
          border-white/15
          pointer-events-none
        "
      />
    </motion.div>
  );
};

/* =========================================================
   TRUST BAR
========================================================= */

const TrustBar = () => {
  return (
    <div
      className="
        mt-8
        bg-white
        rounded-2xl
        border
        border-stone-100
        shadow-[0_3px_20px_rgba(0,0,0,0.04)]
        overflow-hidden
        py-5
      "
    >
      <div className="marquee">
        <div className="marquee-content">

          {/* FIRST SET */}

          {trustItems.map((item, index) => (
            <div
              key={`first-${index}`}
              className="
                flex
                items-center
                gap-3
                min-w-max
                px-8
              "
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span
                className="
                  text-[12px]
                  sm:text-[13px]
                  font-bold
                  text-stone-600
                  whitespace-nowrap
                "
              >
                {item.text}
              </span>
            </div>
          ))}

          {/* SECOND SET */}

          {trustItems.map((item, index) => (
            <div
              key={`second-${index}`}
              className="
                flex
                items-center
                gap-3
                min-w-max
                px-8
              "
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span
                className="
                  text-[12px]
                  sm:text-[13px]
                  font-bold
                  text-stone-600
                  whitespace-nowrap
                "
              >
                {item.text}
              </span>
            </div>
          ))}

        </div>
      </div>

      <style>
        {`
          .marquee {
            width: 100%;
            overflow: hidden;
          }

          .marquee-content {
            display: flex;
            width: max-content;
            animation: marquee 25s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

/* =========================================================
   MAIN OFFERS COMPONENT
========================================================= */

export default function D2DOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH OFFERS FROM BACKEND
  ======================================================= */

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/offers/active`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch offers: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Offers from backend:", data);

        setOffers(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching offers:",
          error
        );

        setError("Unable to load offers.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  /* =======================================================
     HERO OFFERS
  ======================================================= */

  const heroSlides = offers.filter(
    (offer) =>
      offer.type?.toLowerCase() === "hero"
  );

  /* =======================================================
     SIDE OFFERS
  ======================================================= */

  const sideCards = offers.filter(
    (offer) =>
      offer.type?.toLowerCase() === "side"
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        className="
          relative
          w-full
          bg-[#faf9f6]
          px-4
          sm:px-6
          lg:px-8
          xl:px-12
          py-12
          overflow-hidden
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            flex
            items-center
            justify-center
            h-[400px]
          "
        >
          <div
            className="
              w-10
              h-10
              border-4
              border-stone-200
              border-t-teal-500
              rounded-full
              animate-spin
            "
          />
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section
        className="
          relative
          w-full
          bg-[#faf9f6]
          px-4
          sm:px-6
          lg:px-8
          xl:px-12
          py-12
          overflow-hidden
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            flex
            items-center
            justify-center
            h-[400px]
          "
        >
          <p className="text-sm text-stone-500">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        w-full
        bg-[#faf9f6]
        px-4
        sm:px-6
        lg:px-8
        xl:px-12
        py-12
        overflow-hidden
      "
    >
      {/* HEADING */}

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          mb-8
          text-center
        "
      >
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            text-3xl
            sm:text-4xl
            lg:text-5xl
            font-extrabold
            text-stone-800
          "
        >
          Discover Our{" "}
          <span className="text-teal-500">
            Best Deals
          </span>
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
          className="
            mt-3
            text-sm
            sm:text-base
            text-stone-500
            max-w-2xl
            mx-auto
          "
        >
          Grab amazing offers and save more on your favorite products.
        </motion.p>
      </div>

      {/* BACKGROUND PATTERN */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.015]
          pointer-events-none
        "
        style={{
          backgroundImage:
            "radial-gradient(#57534e 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
        "
      >
        {/* HERO + SIDE CARDS */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            gap-5
            items-stretch
          "
        >
          {/* HERO */}

          <HeroSlider
            heroSlides={heroSlides}
          />

          {/* SIDE CARDS */}

          <div
            className="
              w-full
              lg:w-[42%]
              grid
              grid-cols-2
              gap-5
              min-w-0
            "
          >
            {sideCards
              .slice(0, 2)
              .map((card, index) => (
                <SideCard
                  key={card.id}
                  card={card}
                  index={index}
                />
              ))}
          </div>
        </div>

        {/* TRUST BAR */}

        <TrustBar />
      </div>
    </section>
  );
}

