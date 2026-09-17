import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCheck, FaShieldAlt,FaMoneyBillWave,} from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();

 const storedUser = localStorage.getItem("user");

const loggedInUser = storedUser
  ? JSON.parse(storedUser)
  : null;

const userId = loggedInUser?.id;

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [checkoutType, setCheckoutType] = useState("cart");

  const [paymentMethod] = useState("cod");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    const savedItems = localStorage.getItem("checkoutItems");
    const savedDelivery = localStorage.getItem("checkoutDelivery");
    const savedType = localStorage.getItem("checkoutType");

    if (!savedItems || !savedDelivery) {
      navigate("/checkout");
      return;
    }

    try {
      setCheckoutItems(JSON.parse(savedItems));
      setDelivery(JSON.parse(savedDelivery));
      setCheckoutType(savedType || "cart");
    } catch (error) {
      console.error("Unable to load payment information:", error);
      navigate("/checkout");
    }
  }, [navigate]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [checkoutItems]);

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;

  const tax = Math.round(subtotal * 0.05);

  const total = subtotal + shipping + tax;

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const placeOrder = async () => {
  if (!userId) {
    alert("Please login to place your order.");
    return;
  }

  if (!checkoutItems.length || !delivery) {
    return;
  }

  setIsPlacingOrder(true);

    try {
      const orderData = {
        userId: userId,

        items: checkoutItems.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          category: item.category,
          imageUrl: item.imageUrl || item.image,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 0),
        })),

        delivery: delivery,

        paymentMethod: paymentMethod,

        subtotal: subtotal,

        shipping: shipping,

        tax: tax,

        total: total,
      };

      const response = await fetch("http://localhost:8080/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(errorMessage || "Failed to place order");
      }

      const savedOrder = await response.json();

      console.log("Order saved successfully:", savedOrder);

      localStorage.setItem(
        "d2d-last-order",
        JSON.stringify(savedOrder)
      );

      if (checkoutType === "cart") {
        const clearCartResponse = await fetch(
          `http://localhost:8080/cart/${userId}/clear`,
          {
            method: "DELETE",
          }
        );

        if (!clearCartResponse.ok) {
          console.error(
            "Order placed, but cart could not be cleared."
          );
        }

        window.dispatchEvent(new Event("cartUpdated"));
      }

      localStorage.removeItem("buyNow");

      localStorage.removeItem("checkoutItems");

      localStorage.removeItem("checkoutType");

      localStorage.removeItem("checkoutDelivery");

      setPlacedOrder(savedOrder);

      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);

      alert(
        error.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced && placedOrder) {
    return (
      <main className="min-h-screen w-full bg-[#F8FAF9] pt-24 sm:pt-28">
        <section className="px-5 pb-16 sm:px-8 lg:px-16">
          <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
            <div className="w-full rounded-[26px] border border-[#E3EBE7] bg-white p-8 text-center shadow-[0_4px_20px_rgba(24,49,46,0.04)] sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E4F0ED] text-[#0F766E]">
                <FaCheck className="text-2xl" />
              </div>

              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F766E]">
                Order Confirmed
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#18312E] sm:text-4xl">
                Order Placed Successfully!
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7A827E]">
                Thank you for your order. Your order has been
                successfully placed and will be delivered to
                your address.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-[18px] bg-[#F8FAF9] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#89938F]">
                  Order Number
                </p>

                <p className="mt-2 text-lg font-bold text-[#18312E]">
                  {placedOrder.orderNumber}
                </p>

                <div className="mt-4 border-t border-[#E3EBE7] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#89938F]">
                      Payment
                    </span>

                    <span className="text-[11px] font-semibold text-[#18312E]">
                      Cash on Delivery
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#89938F]">
                      Total
                    </span>

                    <span className="text-lg font-bold text-[#0F766E]">
                      {formatPrice(placedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/" className="flex h-12 items-center justify-center gap-3 rounded-full bg-[#0F766E] px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#115E59]">
                  Continue Shopping
                  <FaArrowRight className="text-[9px]" />
                </Link>

                <Link to="/products" className="flex h-12 items-center justify-center rounded-full border border-[#D9E4E0] px-7 text-xs font-semibold uppercase tracking-[0.12em] text-[#18312E] transition-colors hover:border-[#0F766E] hover:text-[#0F766E]">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!checkoutItems.length || !delivery) {
    return null;
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAF9] pt-24 sm:pt-28">
      <section className="px-5 pb-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <Link to="/delivery" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#7A827E] transition-colors hover:text-[#0F766E]">
              <FaArrowLeft className="text-[9px]" />
              Back to Delivery
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F766E]">
              Payment
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#18312E] sm:text-4xl lg:text-5xl">
              Complete Your Order
            </h1>

            <p className="mt-2 text-sm text-[#7A827E]">
              Choose your preferred payment method and place your order.
            </p>
          </div>

          <div className="mb-10 flex items-center justify-center gap-4 sm:justify-end sm:gap-6">
            <div className="flex items-center gap-2 text-[#0F766E]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-[10px] font-bold text-white">
                <FaCheck className="text-[9px]" />
              </span>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] sm:block">
                Cart
              </span>
            </div>

            <span className="h-px w-8 bg-[#D9E4E0] sm:w-10" />

            <div className="flex items-center gap-2 text-[#0F766E]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-[10px] font-bold text-white">
                <FaCheck className="text-[9px]" />
              </span>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] sm:block">
                Delivery
              </span>
            </div>

            <span className="h-px w-8 bg-[#D9E4E0] sm:w-10" />

            <div className="flex items-center gap-2 text-[#0F766E]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-[10px] font-bold text-white">
                03
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Payment
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="rounded-[26px] border border-[#E3EBE7] bg-white p-6 shadow-[0_4px_20px_rgba(24,49,46,0.04)] sm:p-8">
                <h2 className="text-lg font-bold text-[#18312E]">
                  Payment Method
                </h2>

                <p className="mt-1 text-[11px] text-[#89938F]">
                  Select how you would like to pay.
                </p>

                <div className="mt-6 space-y-3">
                  <label className={`flex cursor-pointer items-center gap-4 rounded-[18px] border p-5 transition ${
                    paymentMethod === "cod"
                      ? "border-[#0F766E] bg-[#F2F8F6]"
                      : "border-[#E1E9E5] bg-white hover:border-[#BFD5D0]"
                  }`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} readOnly className="accent-[#0F766E]" />

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F0ED] text-[#0F766E]">
                      <FaMoneyBillWave className="text-sm" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#18312E]">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-[10px] text-[#89938F]">
                        Pay when your order arrives.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-[26px] border border-[#E3EBE7] bg-white p-6 shadow-[0_4px_20px_rgba(24,49,46,0.04)] sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#18312E]">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-[11px] text-[#89938F]">
                      Your order will be delivered here.
                    </p>
                  </div>

                  <Link to="/delivery" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0F766E]">
                    Edit
                  </Link>
                </div>

                <div className="mt-5 rounded-[18px] bg-[#F8FAF9] p-5">
                  <p className="text-sm font-semibold text-[#18312E]">
                    {delivery.fullName}
                  </p>

                  <p className="mt-2 text-[11px] leading-5 text-[#68736F]">
                    {delivery.address}
                    <br />
                    {delivery.city}, {delivery.state} -{" "}
                    {delivery.pincode}
                  </p>

                  <p className="mt-3 text-[11px] text-[#68736F]">
                    {delivery.phone}
                  </p>

                  <p className="mt-1 text-[11px] text-[#68736F]">
                    {delivery.email}
                  </p>
                </div>
              </div>
            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-[26px] bg-[#18312E] p-6 text-white sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  Final Amount
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Order Summary
                </h2>

                <div className="mt-7 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">
                      Subtotal
                    </span>

                    <span>
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">
                      Delivery
                    </span>

                    <span>
                      {shipping === 0
                        ? "FREE"
                        : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">
                      Tax
                    </span>

                    <span>
                      {formatPrice(tax)}
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-white/15 pt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">
                        Total
                      </p>

                      <p className="mt-1 text-2xl font-semibold">
                        {formatPrice(total)}
                      </p>
                    </div>

                    <span className="text-[9px] text-white/40">
                      incl. taxes
                    </span>
                  </div>
                </div>

                <button type="button" onClick={placeOrder} disabled={isPlacingOrder} className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#EE2C57] text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D9234D] disabled:cursor-not-allowed disabled:opacity-60">
                  {isPlacingOrder
                    ? "Placing Order..."
                    : "Place Order"}

                  {!isPlacingOrder && (
                    <FaArrowRight className="text-[9px]" />
                  )}
                </button>

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <FaShieldAlt className="text-sm text-white/50" />

                  <p className="text-[9px] leading-4 text-white/50">
                    Your order information is securely stored for processing.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Payment;

