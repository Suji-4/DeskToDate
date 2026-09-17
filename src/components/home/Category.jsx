import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// =====================================================
// CARD ANIMATION
// =====================================================

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: index * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// =====================================================
// CATEGORY CARD
// =====================================================

const CategoryCard = ({ category, index }) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      whileHover="hovered"
      className="group relative w-full h-full overflow-hidden cursor-pointer rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      {/* IMAGE */}

      <motion.img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover"
        variants={{
          hidden: {
            scale: 1.08,
          },

          visible: {
            scale: 1,
            transition: {
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            },
          },

          hovered: {
            scale: 1.1,
            transition: {
              duration: 0.7,
              ease: "easeOut",
            },
          },
        }}
      />

      {/* SHINE EFFECT */}

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none"
        variants={{
          hidden: {
            x: "-120%",
          },

          visible: {
            x: "-120%",
          },

          hovered: {
            x: "120%",
            transition: {
              duration: 0.8,
              ease: "easeInOut",
            },
          },
        }}
      />

      {/* DARK GRADIENT */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

      {/* BORDER */}

      <div className="absolute inset-2 rounded-xl border border-white/0 group-hover:border-white/40 transition-all duration-500 pointer-events-none" />

      {/* ARROW */}

      <motion.div
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center"
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.6,
            rotate: -30,
          },

          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,

            transition: {
              delay: index * 0.12 + 0.3,
              duration: 0.4,
            },
          },

          hovered: {
            scale: 1.08,
            rotate: 45,
            backgroundColor: "#ffffff",
          },
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:stroke-black transition-colors duration-300"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </motion.div>

      {/* TEXT */}

      <div className="absolute left-5 sm:left-6 bottom-5 sm:bottom-6 z-10">
        <motion.h3
          className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide text-white"
          variants={{
            hovered: {
              x: 5,
            },
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {category.name}
        </motion.h3>

        {/* SHOP NOW */}

        <motion.div
          className="flex items-center gap-1.5 mt-1.5"
          variants={{
            hovered: {
              x: 5,
            },
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <span className="text-xs sm:text-sm text-white/80 font-medium">
            Shop Now
          </span>

          <motion.span
            className="text-white text-base"
            variants={{
              hovered: {
                x: 4,
              },
            }}
            transition={{
              duration: 0.3,
            }}
          >
            →
          </motion.span>
        </motion.div>

        {/* UNDERLINE */}

        <motion.div
          className="h-[2px] bg-white mt-1.5 rounded-full"
          initial={{
            width: 0,
          }}
          variants={{
            hovered: {
              width: "60%",
            },
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        />
      </div>
    </motion.div>
  );
};

// =====================================================
// CATEGORY SECTION
// =====================================================

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        return response.json();
      })
      .then((data) => {
        const toysCategory = data.find(
          (category) => category.name === "Toys"
        );

        if (!toysCategory) {
          console.error("Toys category not found");
          return;
        }

        const images = toysCategory.images || [];

        const toyCategories = [
          {
            name: "TOYS & GAMES",
            image: images[0]
              ? `http://localhost:8080${images[0]}`
              : "",
          },
          {
            name: "REMOTE CARS",
            image: images[3]
              ? `http://localhost:8080${images[3]}`
              : "",
          },
          {
            name: "BOARD GAMES",
            image: images[2]
              ? `http://localhost:8080${images[2]}`
              : "",
          },
          {
            name: "TOY ACCESSORIES",
            image: images[1]
              ? `http://localhost:8080${images[1]}`
              : "",
          },
        ];

        setCategories(toyCategories);
      })
      .catch((error) => {
        console.error("Error loading Toys category:", error);
      });
  }, []);

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-8 flex flex-col items-center justify-center text-center sm:mb-10 lg:mb-12"
        >
          <motion.h2
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
              delay: 0.1,
              duration: 0.6,
            }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Toys
          </motion.h2>

          <motion.div
            initial={{
              width: 0,
            }}
            whileInView={{
              width: 55,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
              duration: 0.5,
            }}
            className="mt-4 h-[2px] bg-gray-900"
          />
        </motion.div>

        {/* CATEGORY GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:h-[480px]">

          {/* LARGE TOYS CARD */}

          <div className="h-[320px] sm:h-[360px] lg:h-full">
            {categories[0] && (
              <CategoryCard
                category={categories[0]}
                index={0}
              />
            )}
          </div>

          {/* RIGHT SIDE */}

          <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[390px] sm:h-[420px] lg:h-full">

            {/* REMOTE CARS */}

            <div className="h-full">
              {categories[1] && (
                <CategoryCard
                  category={categories[1]}
                  index={1}
                />
              )}
            </div>

            {/* BOARD GAMES */}

            <div className="h-full">
              {categories[2] && (
                <CategoryCard
                  category={categories[2]}
                  index={2}
                />
              )}
            </div>

            {/* TOY ACCESSORIES */}

            <div className="col-span-2 h-full">
              {categories[3] && (
                <CategoryCard
                  category={categories[3]}
                  index={3}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;