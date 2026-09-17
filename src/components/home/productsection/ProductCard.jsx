import React, { useEffect, useState } from "react";

import {FaShoppingCart,FaHeart,FaArrowRight,FaCheck,FaStar,FaRegStar,} from "react-icons/fa";

import {isInWishlist as checkWishlist,toggleWishlist as toggleWishlistStorage,} from "../../../utils/Wishlist";

const ProductCard = ({ product, onProductClick }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);


  const storedUser = localStorage.getItem("user");

  const loggedInUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userId = loggedInUser?.id;

  useEffect(() => {
    setIsInWishlist(checkWishlist(product.id));
  }, [product.id]);

  useEffect(() => {
    const checkCart = async () => {
      if (!userId) {
        setAddedToCart(false);
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

        const cartItems = Array.isArray(cartData.items)
          ? cartData.items
          : [];

        const cartProduct = cartItems.find(
          (item) =>
            String(item.productId) ===
            String(product.id)
        );

        setAddedToCart(!!cartProduct);
      } catch (error) {
        console.error("Error checking cart:", error);
        setAddedToCart(false);
      }
    };

    checkCart();

    window.addEventListener("cartUpdated", checkCart);

    return () => {
      window.removeEventListener("cartUpdated", checkCart);
    };
  }, [product.id, userId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [
          reviewsResponse,
          ratingResponse,
        ] = await Promise.all([
          fetch(
            `http://localhost:8080/reviews?productId=${product.id}`
          ),
          fetch(
            `http://localhost:8080/reviews/rating?productId=${product.id}`
          ),
        ]);

        if (
          !reviewsResponse.ok ||
          !ratingResponse.ok
        ) {
          throw new Error(
            "Failed to fetch product reviews"
          );
        }

        const reviewsData =
          await reviewsResponse.json();

        const ratingData =
          await ratingResponse.json();

        setReviewCount(
          Array.isArray(reviewsData)
            ? reviewsData.length
            : 0
        );

        setRating(Number(ratingData) || 0);
      } catch (error) {
        console.error(
          "Error loading product reviews:",
          error
        );

        setReviewCount(0);
        setRating(0);
      }
    };

    if (product.id) {
      fetchReviews();
    }
  }, [product.id]);

  const addToCart = async (event) => {
    event.stopPropagation();

   if (!userId) {
  alert("Please login before adding to cart.");
  return;
}
    try {
      const response = await fetch(
        `http://localhost:8080/cart/${userId}/add?productId=${product.id}&quantity=1`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(
          errorMessage ||
          "Failed to add product to cart"
        );
      }

      setAddedToCart(true);

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error
      );
    }
  };


  const handleWishlist = (event) => {
    event.stopPropagation();

    const updatedWishlist =
      toggleWishlistStorage(product);

    const productExists =
      updatedWishlist.some(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

    setIsInWishlist(productExists);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  const renderStars = (productRating) => {
    const fullStars = Math.floor(productRating);

    return (
      <div className="flex items-center gap-[2px] text-[11px] text-yellow-400">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <span key={index}>
              {index < fullStars ? (
                <FaStar />
              ) : (
                <FaRegStar />
              )}
            </span>
          )
        )}
      </div>
    );
  };

  return (
    <article
      onClick={() =>
        onProductClick?.(product.id)
      }
      className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#E5EBE8] bg-white shadow-[0_3px_14px_rgba(24,49,46,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D5E2DE] hover:shadow-[0_18px_40px_rgba(24,49,46,0.11)]"
    >
      <div className="relative overflow-hidden px-3.5 pt-3.5">
        <div className="absolute left-6 top-6 z-20">
          <span className="inline-flex rounded-full border border-[#D6E5E1] bg-white/95 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-[#0F766E] shadow-sm">
            {product.category}
          </span>
        </div>

        <button type="button" aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"} onClick={handleWishlist} className={`absolute right-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
          isInWishlist
            ? "bg-[#FFF3F8] text-[#D64F83]"
            : "text-[#0F766E] hover:bg-[#FFF3F8] hover:text-[#D64F83]"
        }`}>
          <FaHeart className="text-[12px]" />
        </button>

        <div className="relative flex h-[225px] w-full items-center justify-center overflow-hidden rounded-[19px] bg-[#F3F6F4] sm:h-[235px] lg:h-[245px]">
          <img
            src={product.image}
            alt={product.name}
            className="relative z-10 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </div>

      <div className="relative px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 min-h-[43px] text-[15px] font-semibold leading-[1.4] text-[#18312E] transition-colors duration-300 group-hover:text-[#0F766E] sm:text-[16px]">
              {product.name}
            </h3>

            <div className="mt-2.5 flex h-[20px] items-center gap-2">
              {renderStars(rating)}

              <span className="text-[11px] text-[#7A827E]">
                {rating > 0
                  ? rating.toFixed(1)
                  : "0.0"}
              </span>

              <span className="text-[10px] text-[#9AA39F]">
                ({reviewCount}{" "}
                {reviewCount === 1
                  ? "review"
                  : "reviews"})
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="block text-[8px] font-medium uppercase tracking-[0.14em] text-[#89938F]">
              Price
            </span>

            <span className="mt-1 block text-[18px] font-bold tracking-tight text-[#222222]">
              ₹{product.price}
            </span>

            {product.discount > 0 && (
              <span className="mt-2 inline-flex rounded-full border border-[#CFE2DE] bg-white px-2.5 py-1 text-[9px] font-semibold tracking-wide text-[#0F766E]">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {addedToCart ? (
          <button type="button" onClick={(event) => event.stopPropagation()} className="mt-4 flex h-[43px] w-full items-center justify-center gap-2 rounded-full border border-[#22A06B] bg-[#22A06B] px-4 text-white transition-all duration-300">
            <FaCheck className="text-[11px]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">
              Added to Cart
            </span>
          </button>
        ) : (
          <button type="button" onClick={addToCart} className="mt-4 flex h-[43px] w-full items-center justify-between rounded-full border border-[#D7E4E0] bg-[#F7FAF9] px-4 text-[#18312E] transition-all duration-300 hover:border-[#0F766E] hover:bg-[#0F766E] hover:text-white active:scale-[0.98]">
            <span className="flex items-center gap-2.5">
              <FaShoppingCart className="text-[11px]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.12em]">
                Add to Cart
              </span>
            </span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18312E] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0F766E]">
              <FaArrowRight className="text-[8px]" />
            </span>
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;

