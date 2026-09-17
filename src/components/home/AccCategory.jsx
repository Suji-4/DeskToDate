import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =====================================================
// EXPANDING PANEL
// =====================================================

const Panel = ({ category, index, isActive, onActivate }) => {
  return (
    <motion.div
      onMouseEnter={() => onActivate(index)}
      onClick={() => onActivate(index)}
      animate={{ flex: isActive ? 5 : 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 26 }}
      className="relative h-full min-w-[64px] overflow-hidden cursor-pointer bg-black"
    >
      <motion.img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{
          scale: isActive ? 1 : 1.25,
          filter: isActive ? "grayscale(0%)" : "grayscale(80%)",
        }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      />

      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: isActive ? 0.35 : 0.7 }}
        transition={{ duration: 0.6 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <span className="absolute top-6 left-6 text-[11px] tracking-[0.3em] text-white/50">
        {String(index + 1).padStart(2, "0")}
      </span>

      <AnimatePresence>
        {!isActive && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-end justify-center pb-8"
          >
            <span
              className="text-white text-sm tracking-[0.25em] uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {category.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="absolute left-8 right-8 bottom-8"
          >
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/60 mb-2">
              {category.tag}
            </p>

            <h3 className="text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4">
              {category.name}
            </h3>

            <motion.div
              className="inline-flex items-center gap-3 group/btn"
              whileHover={{ x: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span className="text-xs tracking-[0.2em] uppercase text-white border-b border-white/40 group-hover/btn:border-white pb-1 transition-colors duration-300">
                Shop Now
              </span>

              <span className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-white group-hover/btn:bg-white group-hover/btn:text-black transition-colors duration-300">
                &rarr;
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-0 left-0 h-[3px] bg-white"
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

// =====================================================
// ACCESSORIES SECTION
// =====================================================

const AccCategory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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
        const accessoriesCategory = data.find(
          (category) => category.name === "Accessories"
        );

        if (!accessoriesCategory) {
          console.error("Accessories category not found");
          return;
        }

        const images = accessoriesCategory.images || [];

        const accessoryCategories = [
          {
            name: "Accessories",
            tag: "Everyday carry",
            image: images[0]
              ? `http://localhost:8080${images[0]}`
              : "",
          },
          {
            name: "Corporate Gift Set",
            tag: "For your team",
            image: images[1]
              ? `http://localhost:8080${images[1]}`
              : "",
          },
          {
            name: "Glasses",
            tag: "See it your way",
            image: images[2]
              ? `http://localhost:8080${images[2]}`
              : "",
          },
          {
            name: "Note Books",
            tag: "Write it down",
            image: images[3]
              ? `http://localhost:8080${images[3]}`
              : "",
          },
        ];

        setCategories(accessoryCategories);
      })
      .catch((error) => {
        console.error("Error loading Accessories category:", error);
      });
  }, []);

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col items-center justify-center text-center sm:mb-12 lg:mb-14"
        >
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Accessories
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 55 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 h-[2px] bg-gray-900"
          />
        </motion.div>

        {/* EXPANDING PANELS */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onMouseLeave={() => setActiveIndex(0)}
          className="flex gap-2 h-[420px] sm:h-[480px] lg:h-[520px] w-full"
        >
          {categories.map((category, index) => (
            <Panel
              key={category.name}
              category={category}
              index={index}
              isActive={activeIndex === index}
              onActivate={setActiveIndex}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AccCategory;