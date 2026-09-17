import React, { useEffect, useMemo, useRef, useState } from "react";
import {FaArrowLeft, FaArrowRight, FaShoppingCart,FaHeart,FaStar,FaRegStar,FaCheck,FaTruck, FaShieldAlt,FaUndo, FaUser,} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/home/productsection/ProductCard";

  const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const storedUser = localStorage.getItem("user");

  const loggedInUser = storedUser
  ? JSON.parse(storedUser)
  : null;

  const userId = loggedInUser?.id;

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const reviewSectionRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

 
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setSelectedImage(0);

    fetch(`http://localhost:8080/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        const formattedProduct = {
          ...data,
          image: data.imageUrl
            ? `http://localhost:8080${data.imageUrl}`
            : "",
          images: Array.isArray(data.images)
            ? data.images.map((image) =>
                image.startsWith("http")
                  ? image
                  : `http://localhost:8080${image}`
              )
            : data.imageUrl
              ? [`http://localhost:8080${data.imageUrl}`]
              : [],
        };

        setProduct(formattedProduct);
      })
      .catch((error) => {
        console.error("Error loading product:", error);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        const formattedProducts = Array.isArray(data)
          ? data.map((item) => ({
              ...item,
              image: item.imageUrl
                ? `http://localhost:8080${item.imageUrl}`
                : "",
            }))
          : [];

        setAllProducts(formattedProducts);
      })
      .catch((error) => {
        console.error("Error loading similar products:", error);
        setAllProducts([]);
      });
  }, []);


  useEffect(() => {
    if (!id) {
      return;
    }

    setReviewLoading(true);

    Promise.all([
      fetch(`http://localhost:8080/reviews?productId=${id}`),
      fetch(`http://localhost:8080/reviews/rating?productId=${id}`),
    ])
      .then(async ([reviewsResponse, ratingResponse]) => {
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        if (!ratingResponse.ok) {
          throw new Error("Failed to fetch rating");
        }

        const reviewsData = await reviewsResponse.json();
        const ratingData = await ratingResponse.json();

        setReviews(
          Array.isArray(reviewsData)
            ? reviewsData.map((review) => ({
                ...review,
                date: "Customer review",
              }))
            : []
        );

        setAverageRating(Number(ratingData) || 0);
      })
      .catch((error) => {
        console.error("Error loading reviews:", error);
        setReviews([]);
        setAverageRating(0);
      })
      .finally(() => {
        setReviewLoading(false);
      });
  }, [id]);


  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  const stock = Number(product?.stock ?? 0);

  const isOutOfStock = stock <= 0;

  useEffect(() => {
    if (!product) {
      return;
    }

    const loadCartState = async () => {
      if (!userId) {
    setAddedToCart(false);
    setQuantity(1);
    return;
  }
      try {
        const response = await fetch(`http://localhost:8080/cart/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const cartData = await response.json();

        const cartItems = Array.isArray(cartData.items)
          ? cartData.items
          : [];

        const cartProduct = cartItems.find(
          (item) => String(item.productId) === String(product.id)
        );

        if (cartProduct) {
          const cartQuantity = Number(cartProduct.quantity) || 1;

          setQuantity(
            Math.min(
              Math.max(cartQuantity, 1),
              stock > 0 ? stock : cartQuantity
            )
          );

          setAddedToCart(true);
        } else {
          setQuantity(1);
          setAddedToCart(false);
        }
      } catch (error) {
        console.error("Error loading product cart state:", error);
        setQuantity(1);
        setAddedToCart(false);
      }
    };

    loadCartState();

    window.addEventListener("cartUpdated", loadCartState);

    return () => {
      window.removeEventListener("cartUpdated", loadCartState);
    };
}, [product?.id, stock, userId]);


  const increaseQuantity = () => {
    setQuantity((current) => (current < stock ? current + 1 : current));
  };


  const decreaseQuantity = () => {
    setQuantity((current) => (current > 1 ? current - 1 : current));
  };


  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (!value) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(Math.max(value, 1), stock));
  };


  const handleAddToCart = async () => {

    if (!userId) {
    alert("Please login to add products to your cart.");
    return;
  }
    if (!product || isOutOfStock) {
      return;
    }

    try {
      const cartResponse = await fetch(`http://localhost:8080/cart/${userId}`);

      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartData = await cartResponse.json();

      const cartItems = Array.isArray(cartData.items)
        ? cartData.items
        : [];
      const existingItem = cartItems.find(
        (item) => String(item.productId) === String(product.id)
      );

      let response;
      if (existingItem) {
        response = await fetch(
          `http://localhost:8080/cart/${userId}/update?productId=${encodeURIComponent(
            product.id
          )}&quantity=${quantity}`,
          {
            method: "PUT",
          }
        );
      } else {
        response = await fetch(
          `http://localhost:8080/cart/${userId}/add?productId=${encodeURIComponent(
            product.id
          )}&quantity=${quantity}`,
          {
            method: "POST",
          }
        );
      }

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(errorMessage || "Failed to update cart");
      }

      await response.json();
      setAddedToCart(true);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding product to cart:", error);

      alert(error.message || "Unable to add product to cart");
    }
  };

  const handleBuyNow = () => {
  if (!userId) {
    alert("Please login to continue with Buy Now.");
    return;
  }

  if (!product || isOutOfStock) {
    return;
  }

  const buyNowProduct = {
    ...product,
    quantity,
  };

  localStorage.setItem(
    "buyNow",
    JSON.stringify(buyNowProduct)
  );

  localStorage.setItem(
    "activeCheckoutType",
    "buyNow"
  );

  localStorage.setItem(
    "checkoutType",
    "buyNow"
  );

  navigate("/checkout", {
    state: {
      checkoutType: "buyNow",
      item: buyNowProduct,
    },
  });
};

  const toggleWishlist = () => {
    setIsInWishlist((previous) => !previous);
  };

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const ratingDistribution = useMemo(() => {
    const total = reviews.length || 1;

    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter(
        (review) => Number(review.rating) === star
      ).length;

      const percentage = Math.round((count / total) * 100);

      return {
        star,
        count,
        percentage,
      };
    });
  }, [reviews]);

  const averageReviewRating = useMemo(() => {
    return Number(averageRating || 0).toFixed(1);
  }, [averageRating]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (
      !reviewName.trim() ||
      !reviewComment.trim() ||
      reviewRating === 0 ||
      !id
    ) {
      return;
    }

    setReviewSubmitting(true);

    const newReview = {
      productId: id,
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    };

    try {
      const response = await fetch("http://localhost:8080/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setReviewName("");
      setReviewRating(0);
      setReviewComment("");

      const [reviewsResponse, ratingResponse] = await Promise.all([
        fetch(`http://localhost:8080/reviews?productId=${id}`),
        fetch(`http://localhost:8080/reviews/rating?productId=${id}`),
      ]);

      if (!reviewsResponse.ok || !ratingResponse.ok) {
        throw new Error(
          "Review submitted but failed to refresh reviews"
        );
      }

      const updatedReviews = await reviewsResponse.json();
      const updatedRating = await ratingResponse.json();

      setReviews(
        Array.isArray(updatedReviews)
          ? updatedReviews.map((review) => ({
              ...review,
              date: "Customer review",
            }))
          : []
      );

      setAverageRating(Number(updatedRating) || 0);
    } catch (error) {
      console.error("Error submitting review:", error);

      alert("Unable to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };
  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#F8FAF9] px-6">
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[#18312E]">
            Loading product...
          </p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#F8FAF9] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#18312E]">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-[#7A827E]">
            The product you are looking for does not exist.
          </p>

          <button type="button" onClick={() => navigate("/products")} className="mt-6 rounded-full bg-[#18312E] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#0F766E]">
            Back to Products
          </button>
        </div>
      </section>
    );
  }

  const similarProducts = allProducts
    .filter(
      (item) =>
        item.category === product.category &&
        String(item.id) !== String(product.id)
    )
    .slice(0, 4);

  const remainingProducts = allProducts
    .filter(
      (item) =>
        item.category !== product.category &&
        String(item.id) !== String(product.id)
    )
    .slice(0, 4 - similarProducts.length);

  const displayedSimilarProducts = [
    ...similarProducts,
    ...remainingProducts,
  ];

  return (
    <main className="w-full bg-[#F8FAF9] pt-24 sm:pt-28">
      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button type="button" onClick={() => navigate("/products")} className="mb-7 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A827E] transition-colors hover:text-[#0F766E]">
            <FaArrowLeft className="text-[9px]" />
            Back to Products
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-[#E1E9E5] bg-white p-3 shadow-[0_10px_35px_rgba(24,49,46,0.06)]">
                <div className="absolute left-7 top-7 z-20">
                  <span className="rounded-full border border-[#D6E5E1] bg-white/95 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#0F766E]">
                    {product.category}
                  </span>
                </div>

                <button type="button" aria-label="Add to wishlist" onClick={toggleWishlist} className={`absolute right-7 top-7 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:scale-105 ${isInWishlist ? "text-[#D64F83]" : "text-[#0F766E] hover:text-[#D64F83]"}`}>
                  <FaHeart className="text-[14px]" />
                </button>

                <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-[23px] bg-[#F3F6F4] sm:min-h-[500px]">
                  {productImages[selectedImage] && (
                    <img src={productImages[selectedImage]} alt={`${product.name} view ${selectedImage + 1}`} className="h-full max-h-[520px] w-full object-cover transition-all duration-500" />
                  )}
                </div>

                {productImages.length > 1 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    {productImages.map((image, index) => {
                      const isSelected = selectedImage === index;

                      return (
                        <button key={index} type="button" onClick={() => setSelectedImage(index)} className={`group relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-[14px] border-2 bg-[#F3F6F4] transition-all duration-300 ${isSelected ? "border-[#0F766E]" : "border-transparent hover:border-[#BFD5D0]"}`}>
                          <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />

                          {isSelected && <span className="absolute inset-0 rounded-[12px] ring-1 ring-inset ring-[#0F766E]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0F766E]">
                {product.category}
              </p>

              <h1 className="mt-3 max-w-xl text-[30px] font-bold leading-[1.2] tracking-[-0.035em] text-[#18312E] sm:text-[38px]">
                {product.name}
              </h1>

              <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#737D79]">
                {product.description ||
                  `Discover the quality and thoughtful design behind ${product.name}. This product is designed to bring together everyday usability, attractive design and reliable quality.`}
              </p>

              <button type="button" onClick={scrollToReviews} className="mt-5 flex w-fit items-center gap-3 rounded-full transition hover:opacity-80">
                <div className="flex items-center gap-1 text-[14px] text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) =>
                    index < Math.floor(Number(averageRating) || 0) ? (
                      <FaStar key={index} />
                    ) : (
                      <FaRegStar key={index} />
                    )
                  )}
                </div>

                <span className="text-[13px] font-semibold text-[#18312E]">
                  {averageReviewRating}
                </span>

                <span className="text-[12px] text-[#89938F]">
                  {reviews.length} Reviews
                </span>
              </button>

              <div className="mt-7 flex items-end gap-4">
                <span className="text-[32px] font-bold tracking-tight text-[#222222]">
                  ₹{product.price}
                </span>

                {product.discount > 0 && (
                  <span className="mb-1 rounded-full border border-[#CFE2DE] bg-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#0F766E]">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <div className="my-7 h-px w-full bg-[#E1E9E5]" />

              <div className="mb-5">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                    <span className="text-[12px] font-semibold text-red-500">
                      Out of Stock
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22A06B]" />

                      <span className="text-[12px] font-semibold text-[#168154]">
                        In Stock
                      </span>
                    </div>

                    {stock <= 5 && (
                      <span className="text-[11px] font-medium text-[#D16B43]">
                        Only {stock} left
                      </span>
                    )}

                    {stock > 5 && (
                      <span className="text-[11px] text-[#89938F]">
                        {stock} items available
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isOutOfStock && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.13em] text-[#7A827E]">
                    Quantity
                  </label>

                  <div className="relative w-fit">
                    <select id="quantity" value={quantity} onChange={handleQuantityChange} className="h-11 w-[110px] appearance-none rounded-full border border-[#D8E3DF] bg-white px-5 pr-9 text-[12px] font-semibold text-[#18312E] outline-none transition focus:border-[#0F766E]">
                      {Array.from({ length: stock }, (_, index) => index + 1).map((number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#7A827E]">
                      ▼
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" disabled={isOutOfStock} onClick={handleAddToCart} className={`flex h-12 items-center justify-center gap-3 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-all ${addedToCart ? "bg-[#22A06B]" : "bg-[#18312E] hover:bg-[#0F766E]"} disabled:cursor-not-allowed disabled:bg-[#CBD4D1]`}>
                  {addedToCart ? (
                    <>
                      <FaCheck className="text-[11px]" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="text-[11px]" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button type="button" disabled={isOutOfStock} onClick={handleBuyNow} className="flex h-12 items-center justify-center gap-3 rounded-full border border-[#18312E] bg-white text-[10px] font-semibold uppercase tracking-[0.12em] text-[#18312E] transition hover:bg-[#18312E] hover:text-white disabled:cursor-not-allowed disabled:border-[#CBD4D1] disabled:text-[#A4AEAA]">
                  Buy Now
                  <FaArrowRight className="text-[9px]" />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-[16px] border border-[#E1E9E5] bg-white p-4">
                  <FaTruck className="text-[15px] text-[#0F766E]" />
                  <p className="mt-3 text-[10px] font-semibold text-[#18312E]">
                    Fast Delivery
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-[#89938F]">
                    Quick and reliable delivery
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#E1E9E5] bg-white p-4">
                  <FaShieldAlt className="text-[15px] text-[#0F766E]" />
                  <p className="mt-3 text-[10px] font-semibold text-[#18312E]">
                    Secure Payment
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-[#89938F]">
                    Safe and secure checkout
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#E1E9E5] bg-white p-4">
                  <FaUndo className="text-[15px] text-[#0F766E]" />
                  <p className="mt-3 text-[10px] font-semibold text-[#18312E]">
                    Easy Returns
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-[#89938F]">
                    Hassle-free return policy
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#E1E9E5] bg-white p-4">
                  <FaCheck className="text-[15px] text-[#0F766E]" />
                  <p className="mt-3 text-[10px] font-semibold text-[#18312E]">
                    Quality Checked
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-[#89938F]">
                    Carefully selected products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAF9] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#0F766E]">
                You May Also Like
              </p>

              <h2 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-[#18312E] sm:text-[30px]">
                Similar Products
              </h2>
            </div>

            <button type="button" onClick={() => navigate("/products")} className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E] transition hover:text-[#0F766E] sm:flex">
              View All
              <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          {displayedSimilarProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {displayedSimilarProducts.map((item) => (
                <ProductCard key={item.id} product={item} onProductClick={(productId) => navigate(`/products/${productId}`)} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#D8E2DE] bg-white py-16 text-center">
              <p className="text-[13px] font-semibold text-[#18312E]">
                No similar products found
              </p>
            </div>
          )}
        </div>
      </section>

      <section ref={reviewSectionRef} className="scroll-mt-24 border-t border-[#E2EAE7] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#0F766E]">
              Customer Feedback
            </p>

            <h2 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-[#18312E] sm:text-[32px]">
              Reviews & Ratings
            </h2>

            <p className="mt-2 max-w-lg text-[12px] leading-6 text-[#89938F]">
              See what customers think about this product and share your own
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-[24px] border border-[#E1E9E5] bg-[#F8FAF9] p-7">
              <div className="flex items-end gap-2">
                <span className="text-[48px] font-bold leading-none text-[#18312E]">
                  {averageReviewRating}
                </span>

                <span className="mb-1 text-[12px] text-[#89938F]">
                  / 5
                </span>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[16px] text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) =>
                  index < Math.round(Number(averageReviewRating)) ? (
                    <FaStar key={index} />
                  ) : (
                    <FaRegStar key={index} />
                  )
                )}
              </div>

              <p className="mt-3 text-[11px] text-[#89938F]">
                Based on {reviews.length} customer reviews
              </p>
            </div>

            <div className="rounded-[24px] border border-[#E1E9E5] bg-white p-7">
              <h3 className="text-[13px] font-semibold text-[#18312E]">
                Rating Breakdown
              </h3>

              <div className="mt-6 space-y-4">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex w-[42px] shrink-0 items-center gap-1">
                      <span className="text-[11px] font-semibold text-[#18312E]">
                        {star}
                      </span>

                      <FaStar className="text-[9px] text-yellow-400" />
                    </div>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EAF0ED]">
                      <div className="h-full rounded-full bg-[#0F766E] transition-all duration-700" style={{ width: `${percentage}%` }} />
                    </div>

                    <span className="w-[38px] text-right text-[10px] font-semibold text-[#7A827E]">
                      {percentage}%
                    </span>

                    <span className="w-[25px] text-right text-[9px] text-[#A0A8A4]">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[#E1E9E5] bg-[#F8FAF9] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4F0ED] text-[#0F766E]">
                <FaUser className="text-[14px]" />
              </div>

              <div>
                <h3 className="text-[16px] font-bold text-[#18312E]">
                  Write a Review
                </h3>

                <p className="mt-1 text-[11px] text-[#89938F]">
                  Share your experience with this product.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-7">
              <div>
                <label htmlFor="review-name" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                  Your Name
                </label>

                <input id="review-name" type="text" value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Enter your name" className="h-11 w-full rounded-full border border-[#D9E4E0] bg-white px-5 text-[12px] text-[#18312E] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#0F766E]" />
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                  Your Rating
                </p>

                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starNumber = index + 1;

                    return (
                      <button key={starNumber} type="button" aria-label={`${starNumber} star rating`} onClick={() => setReviewRating(starNumber)} className="transition-transform hover:scale-110">
                        {starNumber <= reviewRating ? (
                          <FaStar className="text-[20px] text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-[20px] text-[#B8C2BE]" />
                        )}
                      </button>
                    );
                  })}

                  <span className="ml-2 text-[11px] font-semibold text-[#7A827E]">
                    {reviewRating} / 5
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="review-comment" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                  Your Review
                </label>

                <textarea id="review-comment" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Write your experience..." rows={5} className="w-full resize-none rounded-[18px] border border-[#D9E4E0] bg-white px-5 py-4 text-[12px] leading-6 text-[#18312E] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#0F766E]" />
              </div>

              <div className="mt-5 flex justify-end">
                <button type="submit" disabled={reviewSubmitting || !reviewName.trim() || !reviewComment.trim() || reviewRating === 0} className="flex h-11 items-center gap-3 rounded-full bg-[#18312E] px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:bg-[#CBD4D1]">
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}

                  {!reviewSubmitting && <FaArrowRight className="text-[9px]" />}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#18312E]">
                  Customer Reviews
                </h3>

                <p className="mt-1 text-[11px] text-[#89938F]">
                  Showing {reviews.length} reviews
                </p>
              </div>
            </div>

            {reviewLoading ? (
              <div className="rounded-[22px] border border-[#E1E9E5] bg-white p-8 text-center">
                <p className="text-[12px] text-[#89938F]">
                  Loading reviews...
                </p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-[22px] border border-[#E1E9E5] bg-white p-5 transition hover:border-[#D2DFDB] sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F1EE] text-[11px] font-bold text-[#0F766E]">
                          {(review.name || "C").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h4 className="text-[12px] font-semibold text-[#18312E]">
                            {review.name}
                          </h4>

                          <p className="mt-1 text-[9px] text-[#9AA39F]">
                            {review.date || "Customer review"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-yellow-400">
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < Number(review.rating) ? (
                            <FaStar key={index} />
                          ) : (
                            <FaRegStar key={index} />
                          )
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-[12px] leading-6 text-[#68736F]">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#D8E2DE] bg-white p-10 text-center">
                <p className="text-[13px] font-semibold text-[#18312E]">
                  No reviews yet
                </p>

                <p className="mt-2 text-[11px] text-[#89938F]">
                  Be the first customer to review this product.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;

