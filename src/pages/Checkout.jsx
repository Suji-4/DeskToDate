import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {FaArrowLeft,FaArrowRight,FaMinus,FaPlus,FaTrash,FaTruck,FaShieldAlt,FaUndo,} from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutType, setCheckoutType] = useState(null);

 const storedUser = localStorage.getItem("user");

const loggedInUser = storedUser
  ? JSON.parse(storedUser)
  : null;

const userId = loggedInUser?.id;

  useEffect(() => {
    const loadCheckoutItems = async () => {
      let type = location.state?.checkoutType;

      if (!type) {
        type = localStorage.getItem("checkoutType");
      }

      if (!type) {
        type = localStorage.getItem("activeCheckoutType");
      }

      if (type === "cart") {
        if (!userId) {
  setCheckoutItems([]);
  setCheckoutType("cart");
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

          const formattedItems = cartItems.map((item) => ({
            id: item.productId,
            productId: item.productId,
            name: item.name,
            category: item.category,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.imageUrl
              ? `http://localhost:8080${item.imageUrl}`
              : "",
          }));

          setCheckoutItems(formattedItems);
          setCheckoutType("cart");

          localStorage.setItem("activeCheckoutType", "cart");
        } catch (error) {
          console.error("Unable to load cart for checkout:", error);

          setCheckoutItems([]);
          setCheckoutType("cart");
        }

        return;
      }

      if (type === "buyNow") {
        let buyNowProduct = null;

        const navigationItem = location.state?.item;

        if (navigationItem) {
          buyNowProduct = Array.isArray(navigationItem)
            ? navigationItem[0]
            : navigationItem;
        }

        if (!buyNowProduct) {
          try {
            const savedBuyNow = localStorage.getItem("buyNow");

            if (savedBuyNow) {
              const parsedBuyNow = JSON.parse(savedBuyNow);

              buyNowProduct = Array.isArray(parsedBuyNow)
                ? parsedBuyNow[0]
                : parsedBuyNow;
            }
          } catch (error) {
            console.error("Unable to load Buy Now product:", error);
          }
        }

        if (buyNowProduct) {
          setCheckoutItems([
            {
              ...buyNowProduct,
              id: buyNowProduct.id || buyNowProduct.productId,
              productId: buyNowProduct.productId || buyNowProduct.id,
              quantity: Number(buyNowProduct.quantity) || 1,
              price: Number(buyNowProduct.price) || 0,
              image:
                buyNowProduct.image ||
                (buyNowProduct.imageUrl
                  ? `http://localhost:8080${buyNowProduct.imageUrl}`
                  : ""),
            },
          ]);
        } else {
          setCheckoutItems([]);
        }

        setCheckoutType("buyNow");

        localStorage.setItem("activeCheckoutType", "buyNow");

        return;
      }

      setCheckoutItems([]);
      setCheckoutType(null);
    };

    loadCheckoutItems();
}, [location.state, location.key, userId]);

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const totalItems = useMemo(() => {
    return checkoutItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [checkoutItems]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [checkoutItems]);

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;

  const tax = Math.round(subtotal * 0.05);

  const total = subtotal + shipping + tax;

  const updateQuantity = async (id, newQuantity) => {
    if (checkoutType === "buyNow") {
      if (newQuantity <= 0) {
        removeItem(id);
        return;
      }

      setCheckoutItems((currentItems) =>
        currentItems.map((item) =>
          String(item.id) === String(id)
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );

      localStorage.setItem(
        "buyNow",
        JSON.stringify({
          ...checkoutItems[0],
          quantity: newQuantity,
        })
      );

      return;
    }

    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/cart/${userId}/update?productId=${id}&quantity=${newQuantity}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(
          errorMessage || "Failed to update cart quantity"
        );
      }

      const cartData = await response.json();

      const cartItems = Array.isArray(cartData.items)
        ? cartData.items
        : [];

      const formattedItems = cartItems.map((item) => ({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        category: item.category,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.imageUrl
          ? `http://localhost:8080${item.imageUrl}`
          : "",
      }));

      setCheckoutItems(formattedItems);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const removeItem = async (id) => {
    if (checkoutType === "buyNow") {
      setCheckoutItems([]);

      localStorage.removeItem("buyNow");

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/cart/${userId}/remove?productId=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(errorMessage || "Failed to remove product");
      }

      const cartData = await response.json();

      const cartItems = Array.isArray(cartData.items)
        ? cartData.items
        : [];

      const formattedItems = cartItems.map((item) => ({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        category: item.category,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.imageUrl
          ? `http://localhost:8080${item.imageUrl}`
          : "",
      }));

      setCheckoutItems(formattedItems);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const continueToDelivery = () => {
    if (!checkoutItems.length) {
      return;
    }

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify(checkoutItems)
    );

    localStorage.setItem("checkoutType", checkoutType);

    navigate("/delivery");
  };

  if (checkoutItems.length === 0) {
    return (
      <section className="min-h-screen w-full bg-[#F8FAF9] px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto flex min-h-[500px] max-w-5xl flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E9EFEB] text-[#0F766E]">
            <FaTruck className="text-2xl" />
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F766E]">
            Checkout
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#18312E] sm:text-4xl">
            No products to checkout
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#7A827E]">
            Add a product to your cart or use Buy Now to continue with
            checkout.
          </p>

          <Link to="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#115E59]">
            Explore Products

            <FaArrowRight className="text-[9px]" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAF9] pt-24 sm:pt-28">
      <section className="px-5 pb-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <Link to={checkoutType === "cart" ? "/cart" : "/products"} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#7A827E] transition-colors hover:text-[#0F766E]">
              <FaArrowLeft className="text-[9px]" />

              {checkoutType === "cart"
                ? "Back to Cart"
                : "Back to Products"}
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F766E]">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#18312E] sm:text-4xl lg:text-5xl">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-[#7A827E]">
              Review your order before entering your delivery details.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F766E]">
                    {checkoutType === "buyNow" ? "Buy Now" : "Cart"}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#18312E]">
                    Your Products
                  </h2>
                </div>

                <span className="pt-1 text-xs font-semibold text-[#7A827E]">
                  {totalItems}
                  {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-5 rounded-[24px] border border-[#E3EBE7] bg-white p-4 shadow-[0_4px_20px_rgba(24,49,46,0.04)] sm:flex-row sm:items-center sm:p-5">
                    <div className="h-32 w-full shrink-0 overflow-hidden rounded-[18px] bg-[#F3F6F4] sm:h-32 sm:w-36">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
                          {item.category}
                        </span>

                        <h2 className="mt-1 text-base font-semibold text-[#18312E] sm:text-lg">
                          {item.name}
                        </h2>

                        <p className="mt-2 text-sm font-bold text-[#222222]">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4 sm:mt-3">
                        <div className="flex h-9 items-center gap-3 rounded-full border border-[#D7E4E0] bg-[#F7FAF9] px-1">
                          <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-[#18312E] transition-colors hover:bg-[#0F766E] hover:text-white">
                            <FaMinus className="text-[8px]" />
                          </button>

                          <span className="min-w-[20px] text-center text-xs font-bold text-[#18312E]">
                            {item.quantity}
                          </span>

                          <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-white transition-colors hover:bg-[#115E59]">
                            <FaPlus className="text-[8px]" />
                          </button>
                        </div>

                        <button type="button" onClick={() => removeItem(item.id)} className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#89938F] transition-colors hover:text-red-500">
                          <FaTrash className="text-[10px]" />

                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#89938F]">
                        Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#18312E]">
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[18px] border border-[#D8E8E5] bg-[#EAF4F3] px-5 py-4">
                <div className="flex items-center gap-3">
                  <FaTruck className="text-sm text-[#0F766E]" />

                  <p className="text-xs leading-5 text-[#49615D]">
                    {subtotal >= 999 ? (
                      <>
                        <span className="font-bold text-[#18312E]">
                          Free delivery unlocked.
                        </span>

                        Your order qualifies for complimentary delivery.
                      </>
                    ) : (
                      <>
                        Add

                        <span className="font-bold text-[#18312E]">
                          {formatPrice(999 - subtotal)}
                        </span>

                        more to get free delivery.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="mb-8 flex items-center justify-end gap-5">
                <div className="flex items-center gap-2 text-[#0F766E]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-[10px] font-bold text-white">
                    01
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                    Cart
                  </span>
                </div>

                <span className="h-px w-8 bg-[#D9E4E0]" />

                <div className="flex items-center gap-2 text-[#A2ACA8]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9E4E0] text-[10px] font-bold">
                    02
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                    Delivery
                  </span>
                </div>

                <span className="h-px w-8 bg-[#D9E4E0]" />

                <div className="flex items-center gap-2 text-[#A2ACA8]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9E4E0] text-[10px] font-bold">
                    03
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                    Payment
                  </span>
                </div>
              </div>

              <div className="rounded-[26px] border border-[#E3EBE7] bg-white p-6 shadow-[0_4px_20px_rgba(24,49,46,0.04)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0F766E]">
                  Order Summary
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#18312E]">
                  Review Order
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7A827E]">
                      Items
                    </span>

                    <span className="font-semibold text-[#18312E]">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7A827E]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[#18312E]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7A827E]">
                      Delivery
                    </span>

                    <span className="font-semibold text-[#0F766E]">
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7A827E]">
                      Tax
                    </span>

                    <span className="font-semibold text-[#18312E]">
                      {formatPrice(tax)}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-[#E5EBE8]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#18312E]">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#18312E]">
                    {formatPrice(total)}
                  </span>
                </div>

                <button type="button" onClick={continueToDelivery} className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#0F766E] text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#115E59]">
                  Continue to Delivery

                  <FaArrowRight className="text-[9px]" />
                </button>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#E5EBE8] pt-5">
                  <div className="text-center">
                    <FaShieldAlt className="mx-auto text-sm text-[#0F766E]" />

                    <p className="mt-2 text-[8px] uppercase tracking-wider text-[#89938F]">
                      Secure
                    </p>
                  </div>

                  <div className="border-x border-[#E5EBE8] text-center">
                    <FaTruck className="mx-auto text-sm text-[#0F766E]" />

                    <p className="mt-2 text-[8px] uppercase tracking-wider text-[#89938F]">
                      Delivery
                    </p>
                  </div>

                  <div className="text-center">
                    <FaUndo className="mx-auto text-sm text-[#0F766E]" />

                    <p className="mt-2 text-[8px] uppercase tracking-wider text-[#89938F]">
                      Returns
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;