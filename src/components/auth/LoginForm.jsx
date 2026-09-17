
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";

const LoginForm = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setLoginSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Invalid email or password."
        );
      }

      const token = data?.token;
      const userData = data?.user;

      if (!token) {
        setError("Token not received from server.");
        return;
      }

      if (!userData) {
        setError("User data missing in response.");
        return;
      }

      const userToStore = {
        ...userData,
        role: userData.role || "USER",
      };

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(userToStore)
      );

      setLoginSuccess(true);

      setTimeout(() => {
        onClose();

        if (userToStore.role === "ADMIN") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener(
        "keydown",
        handleEsc
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.95,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="relative z-10 w-full max-w-md px-4"
          >
            <div className="relative rounded-3xl bg-white p-8 shadow-2xl md:p-10">

              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <FaTimes />
              </button>

              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700">
                  <FaShieldAlt className="text-4xl text-white" />
                </div>
              </div>

              <h1 className="text-center text-2xl font-bold text-gray-900">
                Admin Portal
              </h1>

              <p className="mt-2 mb-8 text-center text-gray-500">
                Sign in to manage your dashboard
              </p>

              {loginSuccess && (
                <div className="mb-5 rounded-xl bg-green-100 p-3 text-center text-sm font-semibold text-green-700">
                  ✅ Login successful! Redirecting...
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-xl bg-red-100 p-3 text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-teal-500">

                    <FaEnvelope className="mr-3 text-gray-400" />

                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full bg-transparent py-3 text-sm outline-none"
                      required
                    />

                  </div>
                </div>

                <div className="mb-7">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-teal-500">

                    <FaLock className="mr-3 text-gray-400" />

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="w-full bg-transparent py-3 text-sm outline-none"
                      required
                    />

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-xl bg-teal-600 py-3.5 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign In "}
                </button>

              </form>

              {/* <p className="mt-7 text-center text-xs text-gray-400">
                Secure Admin Access
              </p> */}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginForm;

