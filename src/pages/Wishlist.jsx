import React, { useEffect, useState } from "react";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/home/productsection/ProductCard";
import { getWishlist } from "../utils/Wishlist";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = () => {
      setWishlist(getWishlist());
    };

    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  return (
    <section className="min-h-screen w-full bg-[#F8FAF9] px-4 pt-28 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-bold tracking-[-0.033em] text-[#18312E] sm:text-[34px]">
            My Wishlist
          </h1>

          <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#7A827E]">
            Save your favourite products and come back to them whenever you want.
          </p>

          {wishlist.length > 0 && (
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0F766E]">
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
            </p>
          )}
        </div>

        {wishlist.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex h-[43px] items-center gap-2.5 rounded-full border border-[#D7E4E0] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#18312E] transition-all duration-300 hover:border-[#0F766E] hover:bg-[#0F766E] hover:text-white"
              >
                <FaArrowLeft className="text-[9px]" />
                Continue Shopping
              </button>
            </div>
          </>
        ) : (

          <div className="flex min-h-[380px] items-center justify-center rounded-[24px] border border-dashed border-[#D8E2DE] bg-white px-5">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F4] text-[#EE2C57]">
                <FaHeart className="text-[22px]" />
              </div>

              <h2 className="mt-5 text-[19px] font-semibold text-[#18312E]">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-[#89938F]">
                You haven't added any products to your wishlist yet.
                Explore our products and save the ones you love.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-6 inline-flex h-[43px] items-center gap-2 rounded-full bg-[#0F766E] px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#115E59] active:scale-[0.98]"
              >
                Explore Products
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
