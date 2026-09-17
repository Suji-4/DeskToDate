import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaArrowLeft, FaArrowRight, FaShoppingBag, FaTruck, FaShieldAlt, FaUndo, FaCheck,} from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  const storedUser = localStorage.getItem("user");

const loggedInUser = storedUser
  ? JSON.parse(storedUser)
  : null;

const userId = loggedInUser?.id;

  const loadCart = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:8080/cart/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cart = await response.json();

      const items = Array.isArray(cart.items) ? cart.items : [];

      const updatedItems = items.map((item) => ({
        ...item,
        id: item.productId,
        image: item.imageUrl
          ? item.imageUrl.startsWith("http")
            ? item.imageUrl
            : `http://localhost:8080${item.imageUrl}`
          : "",
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      }));

      setCartItems(updatedItems);
    } catch (error) {
      console.error("Unable to load cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const updateQuantity = async (id, newQuantity) => {
    const item = cartItems.find((cartItem) => String(cartItem.id) === String(id));

    if (!item) {
      return;
    }

    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/cart/${userId}/update?productId=${item.productId}&quantity=${newQuantity}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update quantity");
      }

      await loadCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Unable to update cart quantity:", error);
      alert(error.message);
    }
  };

  const removeItem = async (id) => {
    const item = cartItems.find((cartItem) => String(cartItem.id) === String(id));

    if (!item) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/cart/${userId}/remove?productId=${item.productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to remove item");
      }

      await loadCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Unable to remove cart item:", error);
      alert(error.message);
    }
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [cartItems]);

  const freeDeliveryLimit = 999;

  const delivery = subtotal >= freeDeliveryLimit || subtotal === 0 ? 0 : 79;

  const remainingForFreeDelivery = Math.max(freeDeliveryLimit - subtotal, 0);

  const total = subtotal + delivery;

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    localStorage.setItem("checkoutCartItems", JSON.stringify(cartItems));
    localStorage.setItem("checkoutType", "cart");

    navigate("/checkout", {
      state: {
        checkoutType: "cart",
      },
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-[#F8FAF9] px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:px-16 lg:pt-40">
        <div className="mx-auto flex min-h-[500px] max-w-5xl flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E9EFEB] text-[#0F766E]">
            <FaShoppingBag className="animate-pulse text-[28px]" />
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F766E]">
            Shopping Cart
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#18312E] sm:text-4xl">
            Loading Your Cart
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#7A827E]">
            We're checking your latest product information.
          </p>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen w-full bg-[#F8FAF9] px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:px-16 lg:pt-40">
        <div className="mx-auto flex min-h-[500px] max-w-5xl flex-col items-center justify-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#E9EFEB] text-[#0F766E]">
            <FaShoppingBag className="text-[28px]" />

            <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#0F766E] shadow-sm">
              0
            </span>
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F766E]">
            Shopping Cart
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#18312E] sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#7A827E]">
            Looks like you haven't added anything to your cart yet. Explore our products and find something you love.
          </p>

          <Link to="/products" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#0F766E] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#115E59]">
            Continue Shopping
            <FaArrowRight className="text-[9px]" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAF9] pt-24 sm:pt-28">
      <section className="px-5 pb-16 sm:px-8 lg:px-16 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9">
            <Link to="/products" className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A827E] transition-colors hover:text-[#0F766E]">
              <FaArrowLeft className="text-[8px]" />
              Continue Shopping
            </Link>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F766E]">
                  Shopping Cart
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#18312E] sm:text-4xl lg:text-5xl">
                  Your Cart
                </h1>

                <p className="mt-2 text-sm text-[#7A827E]">
                  Review your selected products before checkout.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-[#DCE7E3] bg-white px-4 py-2.5 shadow-[0_3px_15px_rgba(24,49,46,0.03)]">
                <FaShoppingBag className="text-[11px] text-[#0F766E]" />

                <span className="text-[11px] font-semibold text-[#18312E]">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_370px]">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#0F766E]">
                    Your Selection
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#18312E]">
                    Cart Items
                  </h2>
                </div>

                <span className="text-[11px] font-medium text-[#89938F]">
                  {cartItems.length} {cartItems.length === 1 ? "product" : "products"}
                </span>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-[24px] border border-[#E1E9E5] bg-white p-4 shadow-[0_5px_25px_rgba(24,49,46,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D1DFDB] hover:shadow-[0_10px_30px_rgba(24,49,46,0.06)] sm:p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-[19px] bg-[#F3F6F4] sm:h-32 sm:w-36">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <span className="inline-flex rounded-full bg-[#EDF5F2] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                            {item.category}
                          </span>

                          <h2 className="mt-2 line-clamp-2 text-base font-bold leading-5 text-[#18312E] sm:text-[17px]">
                            {item.name}
                          </h2>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-bold text-[#222222]">
                              {formatPrice(item.price)}
                            </span>

                            <span className="text-[9px] text-[#A0A8A4]">
                              per item
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-4">
                          <div>
                            <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#A0A8A4]">
                              Quantity
                            </p>

                            <div className="flex h-9 items-center gap-2 rounded-full border border-[#D7E4E0] bg-[#F7FAF9] px-1">
                              <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)} className="flex h-7 w-7 items-center justify-center rounded-full text-[#18312E] transition-all hover:bg-[#0F766E] hover:text-white">
                                <FaMinus className="text-[8px]" />
                              </button>

                              <span className="min-w-[22px] text-center text-xs font-bold text-[#18312E]">
                                {item.quantity}
                              </span>

                              <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-white transition-all hover:bg-[#115E59]">
                                <FaPlus className="text-[8px]" />
                              </button>
                            </div>
                          </div>

                          <button type="button" onClick={() => removeItem(item.id)} className="flex items-center gap-2 rounded-full px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#89938F] transition-colors hover:bg-red-50 hover:text-red-500">
                            <FaTrash className="text-[9px]" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="hidden shrink-0 self-stretch border-l border-[#EDF1EF] pl-6 sm:flex sm:min-w-[95px] sm:flex-col sm:items-end sm:justify-center">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#A0A8A4]">
                          Item Total
                        </p>

                        <p className="mt-1.5 text-lg font-bold text-[#18312E]">
                          {formatPrice(Number(item.price) * Number(item.quantity))}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#EDF1EF] pt-3 sm:hidden">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0A8A4]">
                        Item Total
                      </span>

                      <span className="text-base font-bold text-[#18312E]">
                        {formatPrice(Number(item.price) * Number(item.quantity))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[20px] border border-[#D9E9E5] bg-[#ECF6F4] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-sm">
                    <FaTruck className="text-[12px]" />
                  </div>

                  <div className="flex-1">
                    {delivery === 0 ? (
                      <>
                        <p className="text-[11px] font-bold text-[#18312E]">
                          Free delivery unlocked!
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-[#61736F]">
                          Your order qualifies for complimentary delivery.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[11px] font-bold text-[#18312E]">
                          You're almost there!
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-[#61736F]">
                          Add <span className="font-bold text-[#0F766E]">{formatPrice(remainingForFreeDelivery)}</span> more to unlock free delivery.
                        </p>
                      </>
                    )}

                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-[#0F766E] transition-all duration-500" style={{ width: `${Math.min((subtotal / freeDeliveryLimit) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-[28px] border border-[#E1E9E5] bg-white shadow-[0_8px_35px_rgba(24,49,46,0.05)]">
                <div className="border-b border-[#E7EEEB] px-6 pb-5 pt-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0F766E]">
                    Order Summary
                  </p>

                  <h2 className="mt-1.5 text-xl font-bold text-[#18312E]">
                    Review Your Order
                  </h2>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7A827E]">Items</span>
                      <span className="font-semibold text-[#18312E]">{totalItems}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7A827E]">Subtotal</span>
                      <span className="font-semibold text-[#18312E]">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7A827E]">Delivery</span>

                      <span className={`font-semibold ${delivery === 0 ? "text-[#0F766E]" : "text-[#18312E]"}`}>
                        {delivery === 0 ? "FREE" : formatPrice(delivery)}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-[#E5EBE8]" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#89938F]">
                        Total Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#18312E]">
                        Inclusive of delivery
                      </p>
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-[#18312E]">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <button type="button" onClick={proceedToCheckout} className="group mt-7 flex h-13 w-full items-center justify-center gap-3 rounded-full bg-[#0F766E] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#115E59] hover:shadow-[0_8px_20px_rgba(15,118,110,0.18)]">
                    Proceed to Checkout
                    <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <div className="mt-5 flex items-center justify-center gap-2">
                    <FaShieldAlt className="text-[10px] text-[#0F766E]" />

                    <span className="text-[9px] text-[#89938F]">
                      Secure and encrypted checkout
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-t border-[#E7EEEB]">
                  <div className="px-3 py-5 text-center">
                    <FaShieldAlt className="mx-auto text-[13px] text-[#0F766E]" />
                    <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#89938F]">
                      Secure
                    </p>
                  </div>

                  <div className="border-x border-[#E7EEEB] px-3 py-5 text-center">
                    <FaTruck className="mx-auto text-[13px] text-[#0F766E]" />
                    <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#89938F]">
                      Delivery
                    </p>
                  </div>

                  <div className="px-3 py-5 text-center">
                    <FaUndo className="mx-auto text-[13px] text-[#0F766E]" />
                    <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#89938F]">
                      Returns
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-[#E1E9E5] bg-white px-4 py-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF4F1] text-[#0F766E]">
                  <FaCheck className="text-[10px]" />
                </div>

                <p className="text-[9px] leading-4 text-[#7A827E]">
                  Your cart is saved automatically. You can safely continue shopping and return anytime.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cart;