import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-white px-0 py-10 sm:py-14">

      {/* SOFT MATCHING GLOW */}

      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8b98a] blur-[90px]" />

      {/* FULL WIDTH */}

      <div className="relative z-10 w-full">

        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative w-full overflow-hidden border-y border-[#e8dfd2] bg-[#faf8f4] px-6 py-12 text-center shadow-[0_15px_50px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14">

          {/* TOP MATCHING LINE */}

          <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-full bg-[#d8b98a]" />

          {/* BADGE */}

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#eee7dc] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8d7655]">

            <span className="h-1.5 w-1.5 rounded-full bg-[#b99b6b]" />

            Shop With Us

          </motion.div>

          {/* HEADING */}

          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl font-bold tracking-tight text-[#20201e] sm:text-4xl">

            Find something{" "}

            <span className="text-[#b99b6b]">
              you'll love.
            </span>

          </motion.h2>

          {/* DESCRIPTION */}

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#777269]">
            Explore our latest products and discover your next favorite.
          </motion.p>

          {/* BUTTON */}

          <motion.button initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/products")} className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#20201e] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#b99b6b]">

            <FaShoppingBag className="text-xs" />

            <span>
              Explore Products
            </span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f1e9] text-[#20201e] transition-transform duration-300 group-hover:translate-x-1">
              <FaArrowRight className="text-[9px]" />
            </span>

          </motion.button>

          {/* RIGHT FLOATING CIRCLE */}

          <motion.div animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-6 top-8 hidden h-20 w-20 rounded-full border border-[#d8b98a]/40 md:block" />

          {/* LEFT FLOATING CIRCLE */}

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -left-5 bottom-6 hidden h-14 w-14 rounded-full bg-[#eee7dc] md:block" />

        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;