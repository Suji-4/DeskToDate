import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {FaBars,FaShoppingCart,FaSearch,FaTimes,FaHeart,FaUser,FaUserCircle,FaSignOutAlt,FaChevronDown,FaChevronRight,FaUserPlus,} from "react-icons/fa";

import logo from "../../assets/images/logo.png";
import LoginForm from "../auth/LoginForm";
import { getWishlistCount } from "../../utils/Wishlist";

const Navbar = () => {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState([]);

  const productsRef = useRef(null);
  const accountRef = useRef(null);
const storedUser = localStorage.getItem("user");

const loggedInUser = storedUser
  ? JSON.parse(storedUser)
  : null;

const userId = loggedInUser?.id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading navbar categories:", error);

        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target)
      ) {
        setIsProductsOpen(false);
      }

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
  const updateCartCount = async () => {
    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/cart/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartData = await response.json();

      const items = Array.isArray(cartData.items)
        ? cartData.items
        : [];

      const totalQuantity = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error(
        "Error loading navbar cart count:",
        error
      );

      setCartCount(0);
    }
  };

  updateCartCount();

  window.addEventListener(
    "cartUpdated",
    updateCartCount
  );

  return () => {
    window.removeEventListener(
      "cartUpdated",
      updateCartCount
    );
  };
}, [userId]);

  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlistCount());
    };

    updateWishlistCount();

    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
      setIsMobileMenuOpen(false);
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);

    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);

    setIsProductsOpen(false);
    setIsMobileProductsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setIsAccountOpen(false);
    setIsLoginModalOpen(false);
    setIsMobileMenuOpen(false);

    if (user?.role === "ADMIN") {
      navigate("/dashboard");
      return;
    }

    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);

    navigate("/");
  };

  const goToAccount = () => {
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);

    navigate("/account");
  };

  const goToOrders = () => {
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);

    navigate("/account/orders");
  };

  const goToSignup = () => {
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);

    navigate("/signup");
  };

  const handleHomeClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center h-full px-1 text-[14px] font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#0F766E]"
        : "text-[#26332F] hover:text-[#0F766E]"
    }`;

  return (
    <>
      {/* NAVBAR */}

      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
        <nav className={`relative mx-auto w-full max-w-[1450px] bg-[#FCFCF9] border border-[#E5E9E5] shadow-[0_6px_28px_rgba(15,118,110,0.055)] transition-all duration-200 ${
          isProductsOpen
            ? "rounded-t-[20px] rounded-b-none"
            : "rounded-[20px]"
        }`}>
          {/* DESKTOP NAVBAR */}

          <div className="hidden lg:flex items-center h-[72px] px-6 xl:px-8 gap-7">
            <Link to="/" onClick={handleHomeClick} className="shrink-0 flex items-center">
              <img src={logo} alt="Desk2Date" className="h-[39px] w-auto object-contain" />
            </Link>

            <div className="flex items-center gap-7 h-full ml-5">
              <NavLink to="/" onClick={handleHomeClick} className={navLinkClass}>
                Home
              </NavLink>

              <div ref={productsRef} className="relative h-full flex items-center after:absolute after:left-0 after:right-0 after:-bottom-5 after:h-5" onMouseEnter={() => setIsProductsOpen(true)}>
                <button type="button" onClick={() => {
                  navigate("/products");
                  setIsProductsOpen((prev) => !prev);
                }} className="relative flex items-center gap-2 h-full text-[14px] font-medium text-[#26332F] hover:text-[#0F766E] transition-colors duration-200">
                  Products

                  <FaChevronDown className={`text-[9px] transition-transform duration-200 ${
                    isProductsOpen ? "rotate-180" : ""
                  }`} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSearch} className="ml-auto w-[320px] xl:w-[370px] 2xl:w-[420px] h-[42px] flex items-center rounded-full bg-[#F5F7F5] border border-[#E2E7E2] px-4 transition-all duration-200 focus-within:bg-white focus-within:border-[#9BCAC5] focus-within:shadow-[0_0_0_3px_rgba(66,153,150,0.07)]">
              <FaSearch className="shrink-0 text-[#71807C] text-[14px]" />

              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-transparent outline-none border-none px-3 text-[13px] text-[#26332F] placeholder:text-[#9AA6A2]" />
            </form>

            <button type="button" onClick={() => navigate("/wishlist")} className="relative w-[40px] h-[40px] shrink-0 rounded-full flex items-center justify-center text-[#0F766E] hover:text-[#EE2C57] hover:bg-[#FFF1F4] transition-all duration-200" aria-label="Wishlist">
              <FaHeart className="text-[17px]" />

              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#EE2C57] text-white text-[9px] font-semibold flex items-center justify-center border-2 border-[#FCFCF9]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button type="button" onClick={() => navigate("/cart")} className="relative w-[40px] h-[40px] shrink-0 rounded-full flex items-center justify-center text-[#0F766E] hover:bg-[#EDF8F6] transition-all duration-200" aria-label="Cart">
              <FaShoppingCart className="text-[17px]" />

              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#EE2C57] text-white text-[9px] font-semibold flex items-center justify-center border-2 border-[#FCFCF9]">
                {cartCount}
              </span>
            </button>

            <div className="w-px h-7 bg-[#E1E6E2]" />

            <div ref={accountRef} className="relative shrink-0">
              <button type="button" onClick={() => setIsAccountOpen((prev) => !prev)} className="flex items-center gap-2 text-[13px] font-semibold text-[#26332F] hover:text-[#0F766E] transition-colors duration-200">
                <span className="w-[38px] h-[38px] rounded-full bg-[#EDF8F6] flex items-center justify-center text-[#0F766E]">
                  {isLoggedIn ? (
                    <FaUserCircle className="text-[19px]" />
                  ) : (
                    <FaUser className="text-[15px]" />
                  )}
                </span>

                <span className="hidden xl:block">
                  My Account
                </span>

                <FaChevronDown className={`text-[9px] transition-transform duration-200 ${
                  isAccountOpen ? "rotate-180" : ""
                }`} />
              </button>

              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }} className="absolute right-0 top-[52px] w-[215px] bg-white border border-[#E4E9E5] rounded-[16px] shadow-[0_14px_40px_rgba(20,50,45,0.10)] overflow-hidden p-2">
                    {!isLoggedIn ? (
                      <>
                        <button type="button" onClick={() => {
                          setIsAccountOpen(false);
                          setIsLoginModalOpen(true);
                        }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#EDF8F6] hover:text-[#0F766E] transition-colors">
                          <FaUser className="text-[13px]" />
                          Login
                        </button>

                        <button type="button" onClick={goToSignup} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#FFF1F4] hover:text-[#EE2C57] transition-colors">
                          <FaUserPlus className="text-[13px]" />
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={goToAccount} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#EDF8F6] hover:text-[#0F766E] transition-colors">
                          <FaUser className="text-[13px]" />
                          My Account
                        </button>

                        <button type="button" onClick={goToOrders} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#EDF8F6] hover:text-[#0F766E] transition-colors">
                          <FaShoppingCart className="text-[13px]" />
                          Order History
                        </button>

                        <div className="my-2 h-px bg-[#E8ECE9]" />

                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#FFF1F4] hover:text-[#EE2C57] transition-colors">
                          <FaSignOutAlt className="text-[13px]" />
                          Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DESKTOP MEGA MENU */}

          <AnimatePresence>
            {isProductsOpen && (
              <motion.div initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.18 }} onMouseEnter={() => setIsProductsOpen(true)} onMouseLeave={() => setIsProductsOpen(false)} className="absolute -left-px -right-px top-[71px] z-[90] bg-[#F9FBF9] border-x border-b border-[#DCE4E0] rounded-b-[20px] shadow-[0_20px_45px_rgba(20,50,45,0.12)] before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-white">
                <div className="px-8 py-8">
                  <div className="flex items-end justify-between mb-7">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#0F766E] mb-1">
                        Explore
                      </p>

                      <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#26332F]">
                        Shop by Category
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-12">
                    {categories.map((category) => (
                      <div key={category.id || category.name} className="min-w-0">
                        <button type="button" onClick={() => handleCategoryClick(category.name)} className="group flex items-center gap-2 mb-4 text-left text-[15px] font-semibold text-[#26332F] hover:text-[#0F766E] transition-colors duration-200">
                          <span className="w-[6px] h-[6px] rounded-full bg-[#0F766E] opacity-70 group-hover:opacity-100 transition-opacity" />

                          {category.name}
                        </button>

                        <div className="grid grid-flow-col grid-rows-6 auto-cols-max gap-x-8 gap-y-2">
                          {(category.subcategories || []).map((sub) => (
                            <button key={sub} type="button" onClick={() => handleCategoryClick(sub)} className="group flex items-center gap-2 w-fit text-left text-[13px] text-[#6A7773] hover:text-[#0F766E] transition-all duration-200">
                              <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200">
                                <FaChevronRight className="text-[9px]" />
                              </span>

                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE NAVBAR */}

          <div className="lg:hidden h-[66px] flex items-center justify-between px-4 sm:px-5">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
              <img src={logo} alt="Desk2Date" className="h-[35px] w-auto object-contain" />
            </Link>

            <div className="flex items-center gap-1">
              <button type="button" onClick={() => navigate("/cart")} className="relative w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#52615D] hover:text-[#0F766E] hover:bg-[#EDF8F6] transition-all">
                <FaShoppingCart className="text-[17px]" />

                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#EE2C57] text-white text-[9px] font-semibold flex items-center justify-center border-2 border-[#FCFCF9]">
                  {cartCount}
                </span>
              </button>

              <button type="button" onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#26332F] hover:bg-[#EDF8F6] hover:text-[#0F766E] transition-all" aria-label="Toggle menu">
                {isMobileMenuOpen ? (
                  <FaTimes className="text-[19px]" />
                ) : (
                  <FaBars className="text-[19px]" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="lg:hidden overflow-hidden border-t border-[#E8ECE9]">
                <div className="px-4 sm:px-5 py-5">
                  <form onSubmit={handleSearch} className="w-full h-[44px] flex items-center rounded-full bg-[#F5F7F5] border border-[#E2E7E2] px-4 mb-5">
                    <FaSearch className="text-[#71807C] text-[14px]" />

                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-transparent outline-none px-3 text-[13px] text-[#26332F] placeholder:text-[#9AA6A2]" />
                  </form>

                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-[14px] font-medium text-[#26332F] border-b border-[#EEF1EF]">
                    Home
                  </NavLink>

                  <div className="border-b border-[#EEF1EF]">
                    <button type="button" onClick={() => {
                      navigate("/products");
                      setIsMobileProductsOpen((prev) => !prev);
                    }} className="w-full flex items-center justify-between py-3 text-[14px] font-medium text-[#26332F]">
                      Products

                      <FaChevronDown className={`text-[9px] transition-transform duration-200 ${
                        isMobileProductsOpen ? "rotate-180" : ""
                      }`} />
                    </button>

                    <AnimatePresence>
                      {isMobileProductsOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pb-3 pl-3">
                            {categories.map((category) => (
                              <div key={category.id || category.name} className="mb-4 last:mb-0">
                                <button type="button" onClick={() => handleCategoryClick(category.name)} className="text-left text-[13px] font-semibold text-[#0F766E] mb-2">
                                  {category.name}
                                </button>

                                <div className="flex flex-col gap-2 pl-3">
                                  {(category.subcategories || []).map((sub) => (
                                    <button key={sub} type="button" onClick={() => handleCategoryClick(sub)} className="text-left text-[12px] text-[#687571] hover:text-[#0F766E] transition-colors">
                                      {sub}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button type="button" onClick={() => {
                    navigate("/wishlist");
                    setIsMobileMenuOpen(false);
                  }} className="w-full flex items-center gap-3 py-3 text-left text-[14px] font-medium text-[#26332F] border-b border-[#EEF1EF]">
                    <FaHeart className="text-[#EE2C57] text-[15px]" />

                    <span className="flex-1">
                      Wishlist
                    </span>

                    {wishlistCount > 0 && (
                      <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#EE2C57] text-white text-[9px] font-semibold flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button type="button" onClick={() => {
                    navigate("/cart");
                    setIsMobileMenuOpen(false);
                  }} className="w-full flex items-center gap-3 py-3 text-left text-[14px] font-medium text-[#26332F] border-b border-[#EEF1EF]">
                    <FaShoppingCart className="text-[#0F766E] text-[15px]" />

                    Cart
                  </button>

                  <div className="pt-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8A9692] mb-2">
                      Account
                    </p>

                    {!isLoggedIn ? (
                      <div className="flex flex-col gap-2">
                        <button type="button" onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsLoginModalOpen(true);
                        }} className="w-full flex items-center gap-3 px-3 py-3 rounded-[12px] bg-[#EDF8F6] text-[#0F766E] text-[13px] font-semibold">
                          <FaUser />
                          Login
                        </button>

                        <button type="button" onClick={goToSignup} className="w-full flex items-center gap-3 px-3 py-3 rounded-[12px] bg-[#FFF1F4] text-[#EE2C57] text-[13px] font-semibold">
                          <FaUserPlus />
                          Sign Up
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={goToAccount} className="w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#EDF8F6] hover:text-[#0F766E] transition-colors">
                          <FaUser />
                          My Account
                        </button>

                        <button type="button" onClick={goToOrders} className="w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#EDF8F6] hover:text-[#0F766E] transition-colors">
                          <FaShoppingCart />
                          Order History
                        </button>

                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-left text-[13px] font-medium text-[#26332F] hover:bg-[#FFF1F4] hover:text-[#EE2C57] transition-colors">
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* LOGIN MODAL */}

      <LoginForm isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default Navbar;

