import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";

// =====================================================
// DATA
// =====================================================

const categories = [
  "Toys",
  "Home Decor",
  "Stationary",
  "Baby Dress",
];

const subcategories = {
  Toys: [
    "RC Cars",
    "Soft Toys",
    "Educational Toys",
    "Kids Toys",
  ],

  "Home Decor": [
    "Wall Art",
    "Wall Clock",
    "Photo Frames",
    "Home Accessories",
  ],

  Stationary: [
    "Notebooks",
    "Pens",
    "School Supplies",
    "Writing Accessories",
  ],

  "Baby Dress": [
    "Baby Boys",
    "Baby Girls",
    "Baby Sets",
    "Newborn",
  ],
};

const discounts = [
  "10% and above",
  "20% and above",
  "30% and above",
  "40% and above",
];

// =====================================================
// FILTER SECTION
// =====================================================

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-b border-gray-200">

      <button
        type="button"
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          justify-between
          px-5
          py-4
        "
      >

        <span
          className="
            text-sm
            font-semibold
            text-gray-800
          "
        >
          {title}
        </span>

        {isOpen ? (
          <FaChevronUp className="text-xs text-gray-500" />
        ) : (
          <FaChevronDown className="text-xs text-gray-500" />
        )}

      </button>

      <AnimatePresence initial={false}>

        {isOpen && (

          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="overflow-hidden"
          >

            <div className="px-5 pb-4">
              {children}
            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

// =====================================================
// FILTER OPTION
// =====================================================

const FilterOption = ({
  label,
  active,
  onClick,
  sub = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        mb-1
        flex
        w-full
        items-center
        rounded-lg
        text-left
        transition
        ${
          sub
            ? "px-3 py-2 text-xs"
            : "px-3 py-2.5 text-sm"
        }
        ${
          active
            ? "bg-black font-medium text-white"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );
};

// =====================================================
// PRODUCT FILTER
// =====================================================

const ProductFilter = ({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  discount,
  setDiscount,
}) => {

  // ===================================================
  // SECTIONS
  // ===================================================

  const [openSections, setOpenSections] =
    useState({
      category: true,
      price: true,
      discount: true,
    });

  // ===================================================
  // CATEGORY DROPDOWN
  // ===================================================

  const [openCategory, setOpenCategory] =
    useState("");

  // ===================================================
  // TOGGLE SECTION
  // ===================================================

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ===================================================
  // CATEGORY
  // ===================================================

  const handleCategoryClick = (value) => {

    if (category === value) {
      setCategory("");
      setSubcategory("");
      setOpenCategory("");
      return;
    }

    setCategory(value);
    setSubcategory("");
    setOpenCategory(value);
  };

  // ===================================================
  // SUBCATEGORY
  // ===================================================

  const handleSubcategoryClick = (value) => {

    if (subcategory === value) {
      setSubcategory("");
    } else {
      setSubcategory(value);
    }

  };

  // ===================================================
  // DISCOUNT
  // ===================================================

  const handleDiscountClick = (value) => {

    if (discount === value) {
      setDiscount("");
    } else {
      setDiscount(value);
    }

  };

  // ===================================================
  // CLEAR
  // ===================================================

  const clearAll = () => {

    setCategory("");
    setSubcategory("");

    setMinPrice(0);
    setMaxPrice(5000);

    setDiscount("");
    setOpenCategory("");

  };

  // ===================================================
  // ACTIVE COUNT
  // ===================================================

  const priceActive =
    minPrice > 0 || maxPrice < 5000;

  const activeCount = [
    category,
    subcategory,
    discount,
    priceActive ? "price" : "",
  ].filter(Boolean).length;

  return (

    <div className="w-full bg-white">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-gray-200
          px-5
          py-5
        "
      >

        <div className="flex items-center gap-2">

          <h2
            className="
              text-lg
              font-bold
              text-gray-900
            "
          >
            Filters
          </h2>

          {activeCount > 0 && (

            <span
              className="
                flex
                h-6
                min-w-6
                items-center
                justify-center
                rounded-full
                bg-black
                px-2
                text-xs
                font-semibold
                text-white
              "
            >
              {activeCount}
            </span>

          )}

        </div>

        {activeCount > 0 && (

          <button
            type="button"
            onClick={clearAll}
            className="
              text-xs
              font-semibold
              text-red-500
            "
          >
            Clear All
          </button>

        )}

      </div>

      {/* ===============================================
          ACTIVE FILTERS
      =============================================== */}

      {activeCount > 0 && (

        <div
          className="
            flex
            flex-wrap
            gap-2
            border-b
            border-gray-200
            px-5
            py-4
          "
        >

          {category && (

            <button
              type="button"
              onClick={() => {
                setCategory("");
                setSubcategory("");
                setOpenCategory("");
              }}
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-gray-100
                px-3
                py-1.5
                text-xs
              "
            >

              {category}

              <FaTimes className="text-[9px]" />

            </button>

          )}

          {subcategory && (

            <button
              type="button"
              onClick={() =>
                setSubcategory("")
              }
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-gray-100
                px-3
                py-1.5
                text-xs
              "
            >

              {subcategory}

              <FaTimes className="text-[9px]" />

            </button>

          )}

          {priceActive && (

            <button
              type="button"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(5000);
              }}
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-gray-100
                px-3
                py-1.5
                text-xs
              "
            >

              ₹{minPrice.toLocaleString()} - ₹
              {maxPrice.toLocaleString()}

              <FaTimes className="text-[9px]" />

            </button>

          )}

          {discount && (

            <button
              type="button"
              onClick={() =>
                setDiscount("")
              }
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-gray-100
                px-3
                py-1.5
                text-xs
              "
            >

              {discount}

              <FaTimes className="text-[9px]" />

            </button>

          )}

        </div>

      )}

      {/* ===============================================
          CATEGORY
      =============================================== */}

      <FilterSection
        title="Category"
        isOpen={openSections.category}
        onToggle={() =>
          toggleSection("category")
        }
      >

        {categories.map((item) => {

          const selected =
            category === item;

          const dropdownOpen =
            openCategory === item;

          return (
            <div key={item}>

              {/* CATEGORY */}

              <button
                type="button"
                onClick={() =>
                  handleCategoryClick(item)
                }
                className={`
                  mb-1
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  ${
                    selected
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >

                <span>{item}</span>

                {dropdownOpen ? (
                  <FaChevronUp className="text-[10px]" />
                ) : (
                  <FaChevronDown className="text-[10px]" />
                )}

              </button>

              {/* SUBCATEGORY */}

              <AnimatePresence initial={false}>

                {dropdownOpen && (

                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="overflow-hidden"
                  >

                    <div
                      className="
                        mb-2
                        ml-3
                        border-l-2
                        border-gray-200
                        pl-3
                      "
                    >

                      {subcategories[
                        item
                      ].map((subItem) => (

                        <FilterOption
                          key={subItem}
                          label={subItem}
                          sub
                          active={
                            subcategory ===
                            subItem
                          }
                          onClick={() =>
                            handleSubcategoryClick(
                              subItem
                            )
                          }
                        />

                      ))}

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>
          );

        })}

      </FilterSection>

      {/* ===============================================
          PRICE RANGE
      =============================================== */}

      <FilterSection
        title="Price Range"
        isOpen={openSections.price}
        onToggle={() =>
          toggleSection("price")
        }
      >

        <div className="px-1 pt-1">

          {/* PRICE VALUES */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                px-3
                py-2
              "
            >

              <p
                className="
                  text-[10px]
                  font-medium
                  text-gray-400
                "
              >
                MIN
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                ₹{minPrice.toLocaleString()}
              </p>

            </div>

            <span className="text-gray-400">
              —
            </span>

            <div
              className="
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                px-3
                py-2
              "
            >

              <p
                className="
                  text-[10px]
                  font-medium
                  text-gray-400
                "
              >
                MAX
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                ₹{maxPrice.toLocaleString()}
              </p>

            </div>

          </div>

          {/* ===========================================
              MIN PRICE SLIDER
          =========================================== */}

          <div className="mb-5">

            <div
              className="
                mb-2
                flex
                justify-between
                text-xs
                text-gray-500
              "
            >

              <span>Minimum</span>

              <span>
                ₹{minPrice.toLocaleString()}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={minPrice}
              onChange={(e) => {

                const value =
                  Number(e.target.value);

                if (value <= maxPrice) {
                  setMinPrice(value);
                }

              }}
              className="
                h-1.5
                w-full
                cursor-pointer
                appearance-none
                rounded-lg
                bg-gray-200
                accent-black
              "
            />

          </div>

          {/* ===========================================
              MAX PRICE SLIDER
          =========================================== */}

          <div>

            <div
              className="
                mb-2
                flex
                justify-between
                text-xs
                text-gray-500
              "
            >

              <span>Maximum</span>

              <span>
                ₹{maxPrice.toLocaleString()}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => {

                const value =
                  Number(e.target.value);

                if (value >= minPrice) {
                  setMaxPrice(value);
                }

              }}
              className="
                h-1.5
                w-full
                cursor-pointer
                appearance-none
                rounded-lg
                bg-gray-200
                accent-black
              "
            />

          </div>

          {/* RESET PRICE */}

          {priceActive && (

            <button
              type="button"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(5000);
              }}
              className="
                mt-4
                text-xs
                font-medium
                text-red-500
                hover:text-red-600
              "
            >
              Reset price
            </button>

          )}

        </div>

      </FilterSection>

      {/* ===============================================
          DISCOUNT
      =============================================== */}

      <FilterSection
        title="Discount"
        isOpen={openSections.discount}
        onToggle={() =>
          toggleSection("discount")
        }
      >

        {discounts.map((item) => (

          <FilterOption
            key={item}
            label={item}
            active={discount === item}
            onClick={() =>
              handleDiscountClick(item)
            }
          />

        ))}

      </FilterSection>

    </div>
  );
};

export default ProductFilter;