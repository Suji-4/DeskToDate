import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {FaArrowLeft,FaArrowRight,FaCheck,FaMapMarkerAlt,FaShieldAlt,FaTruck,} from "react-icons/fa";

const Delivery = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

const loggedInUser = storedUser
  ? JSON.parse(storedUser)
  : null;

const userId = loggedInUser?.id;

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutType, setCheckoutType] = useState("cart");

  const [delivery, setDelivery] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem("checkoutItems");
    const savedType = localStorage.getItem("checkoutType");

    if (!savedItems) {
      navigate("/checkout");
      return;
    }

    try {
      setCheckoutItems(JSON.parse(savedItems));
      setCheckoutType(savedType || "cart");
    } catch (error) {
      console.error("Unable to load checkout:", error);
      navigate("/checkout");
      return;
    }

    const savedDelivery = localStorage.getItem("checkoutDelivery");

    if (savedDelivery) {
      try {
        setDelivery(JSON.parse(savedDelivery));
      } catch (error) {
        console.error("Unable to load delivery information:", error);
      }
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDelivery((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!delivery.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!delivery.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!delivery.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(delivery.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!delivery.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!delivery.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!delivery.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!delivery.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(delivery.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const continueToPayment = async (event) => {
    event.preventDefault();

    if (!userId) {
  alert("Please login to continue.");
  return;
}

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:8080/delivery/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(delivery),
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        throw new Error(
          errorMessage || "Failed to save delivery details"
        );
      }

      const savedDelivery = await response.json();

      localStorage.setItem(
        "checkoutDelivery",
        JSON.stringify(savedDelivery)
      );

      localStorage.setItem(
        "checkoutItems",
        JSON.stringify(checkoutItems)
      );

      localStorage.setItem("checkoutType", checkoutType);

      navigate("/payment");
    } catch (error) {
      console.error("Error saving delivery details:", error);

      alert(
        "Unable to save delivery details. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (field) =>
    `h-12 w-full rounded-full border bg-white px-5 text-[12px] text-[#18312E] outline-none transition placeholder:text-[#A0A8A4] ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-[#D9E4E0] focus:border-[#0F766E]"
    }`;

  if (!checkoutItems.length) {
    return null;
  }

  return (
    <main className="min-h-screen w-full bg-[#F8FAF9] pt-24 sm:pt-28">
      <section className="px-5 pb-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <Link to="/checkout" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#7A827E] transition-colors hover:text-[#0F766E]">
              <FaArrowLeft className="text-[9px]" />
              Back to Checkout
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F766E]">
              Delivery
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#18312E] sm:text-4xl lg:text-5xl">
              Delivery Information
            </h1>

            <p className="mt-2 text-sm text-[#7A827E]">
              Enter your details so we know where to deliver your order.
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
                02
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Delivery
              </span>
            </div>

            <span className="h-px w-8 bg-[#D9E4E0] sm:w-10" />

            <div className="flex items-center gap-2 text-[#A2ACA8]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9E4E0] text-[10px] font-bold">
                03
              </span>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] sm:block">
                Payment
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={continueToPayment} className="rounded-[26px] border border-[#E3EBE7] bg-white p-6 shadow-[0_4px_20px_rgba(24,49,46,0.04)] sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4F0ED] text-[#0F766E]">
                  <FaMapMarkerAlt className="text-[14px]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#18312E]">
                    Where should we deliver?
                  </h2>

                  <p className="mt-1 text-[11px] text-[#89938F]">
                    Please provide your delivery details.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="fullName" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                  Full Name
                </label>

                <input id="fullName" name="fullName" type="text" value={delivery.fullName} onChange={handleChange} placeholder="Enter your full name" className={inputClass("fullName")} />

                {errors.fullName && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                    Email Address
                  </label>

                  <input id="email" name="email" type="email" value={delivery.email} onChange={handleChange} placeholder="you@example.com" className={inputClass("email")} />

                  {errors.email && (
                    <p className="mt-2 text-[10px] text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                    Phone Number
                  </label>

                  <input id="phone" name="phone" type="tel" maxLength="10" value={delivery.phone} onChange={handleChange} placeholder="10-digit mobile number" className={inputClass("phone")} />

                  {errors.phone && (
                    <p className="mt-2 text-[10px] text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="address" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                  Full Address
                </label>

                <textarea id="address" name="address" value={delivery.address} onChange={handleChange} placeholder="House / Flat number, street, area" rows={4} className="w-full resize-none rounded-[18px] border border-[#D9E4E0] bg-white px-5 py-4 text-[12px] leading-6 text-[#18312E] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#0F766E]" />

                {errors.address && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                    City
                  </label>

                  <input id="city" name="city" type="text" value={delivery.city} onChange={handleChange} placeholder="Enter city" className={inputClass("city")} />

                  {errors.city && (
                    <p className="mt-2 text-[10px] text-red-500">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                    State
                  </label>

                  <input id="state" name="state" type="text" value={delivery.state} onChange={handleChange} placeholder="Enter state" className={inputClass("state")} />

                  {errors.state && (
                    <p className="mt-2 text-[10px] text-red-500">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="pincode" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A827E]">
                  Pincode
                </label>

                <input id="pincode" name="pincode" type="text" maxLength="6" value={delivery.pincode} onChange={handleChange} placeholder="6-digit pincode" className="h-12 w-full rounded-full border border-[#D9E4E0] bg-white px-5 text-[12px] text-[#18312E] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#0F766E] sm:w-1/2" />

                {errors.pincode && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {errors.pincode}
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={isSaving} className="flex h-12 items-center gap-3 rounded-full bg-[#0F766E] px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSaving ? "Saving..." : "Continue to Payment"}

                  {!isSaving && (
                    <FaArrowRight className="text-[9px]" />
                  )}
                </button>
              </div>
            </form>

            <aside className="h-fit rounded-[26px] bg-[#18312E] p-7 text-white lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Delivery
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Almost there
              </h2>

              <p className="mt-3 text-[12px] leading-6 text-white/60">
                Your delivery information is saved securely and will be used to complete your order.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <FaTruck className="mt-1 text-[#8FD0C8]" />

                  <div>
                    <p className="text-[11px] font-semibold">
                      Reliable Delivery
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-white/50">
                      Your order will be delivered to the address you provide.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaShieldAlt className="mt-1 text-[#8FD0C8]" />

                  <div>
                    <p className="text-[11px] font-semibold">
                      Secure Information
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-white/50">
                      Your information is protected throughout checkout.
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

export default Delivery;

