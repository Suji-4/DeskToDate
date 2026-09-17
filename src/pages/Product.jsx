import React, { useMemo, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/home/productsection/ProductCard";

  const Product = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [discount, setDiscount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;

  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        const backendProducts = Array.isArray(data) ? data : [];

        const formattedProducts = backendProducts.map((product) => ({
          ...product,

          image: product.imageUrl
            ? `http://localhost:8080${product.imageUrl}`
            : "",
        }));

        setProducts(formattedProducts);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getProductPrice = (price) => {
    if (typeof price === "number") {
      return price;
    }

    if (!price) {
      return 0;
    }

    const cleanedPrice = String(price)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "");

    return Number(cleanedPrice) || 0;
  };

  const getProductDiscount = (product) => {
    const value =
      product.discountPercentage ??
      product.discount ??
      0;

    if (typeof value === "number") {
      return value;
    }

    return (
      Number(
        String(value)
          .replace("%", "")
          .replace(/[^\d.]/g, "")
      ) || 0
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      const searchText = String(searchQuery || "")
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        String(product.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.category || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.subcategory || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.description || "")
          .toLowerCase()
          .includes(searchText);

      if (!matchesSearch) {
        return false;
      }

      const urlCategory = String(categoryQuery || "")
        .trim()
        .toLowerCase();

      const productCategory = String(product.category || "")
        .trim()
        .toLowerCase();

      const productSubcategory = String(
        product.subcategory || ""
      )
        .trim()
        .toLowerCase();

      if (
        urlCategory &&
        productCategory !== urlCategory &&
        productSubcategory !== urlCategory
      ) {
        return false;
      }

      const selectedCategory = String(category || "")
        .trim()
        .toLowerCase();

      if (
        selectedCategory &&
        productCategory !== selectedCategory
      ) {
        return false;
      }

      const selectedSubcategory = String(
        subcategory || ""
      )
        .trim()
        .toLowerCase();

      if (
        selectedSubcategory &&
        productSubcategory !== selectedSubcategory
      ) {
        return false;
      }

      const productPrice = getProductPrice(
        product.price
      );

      if (
        productPrice < Number(minPrice) ||
        productPrice > Number(maxPrice)
      ) {
        return false;
      }

      if (discount) {
        const productDiscount =
          getProductDiscount(product);

        const selectedDiscount = Number(
          String(discount).replace(/[^\d]/g, "")
        );

        if (productDiscount < selectedDiscount) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    categoryQuery,
    category,
    subcategory,
    minPrice,
    maxPrice,
    discount,
  ]);

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const endIndex =
    startIndex + productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      endIndex
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    category,
    subcategory,
    minPrice,
    maxPrice,
    discount,
    searchQuery,
    categoryQuery,
  ]);


  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setCategory("");
    setSubcategory("");
    setMinPrice(0);
    setMaxPrice(5000);
    setDiscount("");
    setCurrentPage(1);
  };

  const handleApplyFilters = (filters) => {
    setCategory(filters.category || "");
    setSubcategory(filters.subcategory || "");
    setMinPrice(Number(filters.minPrice) || 0);
    setMaxPrice(Number(filters.maxPrice) || 5000);
    setDiscount(filters.discount || "");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(category) ||
    Boolean(subcategory) ||
    minPrice > 0 ||
    maxPrice < 5000 ||
    Boolean(discount);

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section className="fixed inset-0 z-0 w-full overflow-hidden bg-white pt-[104px]">
      <div className="h-full w-full overflow-y-auto overscroll-contain">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)]">

          <aside className="sticky top-0 hidden h-[calc(100vh-104px)] overflow-hidden border-r border-gray-200 bg-white lg:block">
            <div className="h-full w-full overflow-y-auto overscroll-contain p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
              <ProductFilter
  category={category}
  setCategory={setCategory}
  subcategory={subcategory}
  setSubcategory={setSubcategory}
  minPrice={minPrice}
  setMinPrice={setMinPrice}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}
  discount={discount}
  setDiscount={setDiscount}
/>
            </div>
          </aside>
          <main className="min-w-0 w-full bg-white">

            <div className="px-5 pb-4 pt-6 sm:px-7">
              <div className="flex items-center justify-between gap-4">

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    All Products
                  </h1>

                  <p className="mt-1 max-w-3xl text-sm text-gray-500">
                    Explore our carefully selected collection of everyday
                    essentials, playful finds and beautiful home pieces.
                  </p>
                </div>

                <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600 sm:flex">
                  <span>☷</span>
                  <span>{filteredProducts.length} Products</span>
                </div>

              </div>

              <div className="mt-5 flex items-center justify-between">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-teal-700 transition hover:text-teal-900"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2">

                  {category && (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      {category}
                    </span>
                  )}

                  {subcategory && (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      {subcategory}
                    </span>
                  )}

                  {(minPrice > 0 || maxPrice < 5000) && (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      ₹{minPrice.toLocaleString()} - ₹
                      {maxPrice.toLocaleString()}
                    </span>
                  )}

                  {discount && (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      {discount}
                    </span>
                  )}

                </div>
              )}
            </div>

            <div className="px-5 pb-10 sm:px-7">

              {loading ? (

                <div className="flex min-h-[400px] items-center justify-center">
                  <p className="text-sm text-gray-500">
                    Loading products...
                  </p>
                </div>

              ) : currentProducts.length > 0 ? (

                <>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {currentProducts.map((product, index) => (
                      <div
                        key={product.id || index}
                        className="cursor-pointer"
                        onClick={() =>
                          handleProductClick(product)
                        }
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-gray-100 pt-7 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          goToPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <FaChevronLeft size={12} />
                        <span>Previous</span>
                      </button>


                      <div className="flex items-center gap-2">
                        {pageNumbers.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`flex h-10 min-w-[40px] items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-all ${
                              currentPage === page
                                ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                                : "border-gray-200 bg-white text-gray-700 hover:border-teal-600 hover:text-teal-700"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          goToPage(currentPage + 1)
                        }
                        disabled={
                          currentPage === totalPages
                        }
                        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>Next</span>
                        <FaChevronRight size={12} />
                      </button>

                    </div>
                  )}


                  {totalPages > 1 && (
                    <p className="mt-4 text-center text-xs text-gray-500">
                      Showing{" "}
                      <span className="font-medium text-gray-700">
                        {startIndex + 1}
                      </span>{" "}
                      -{" "}
                      <span className="font-medium text-gray-700">
                        {Math.min(
                          endIndex,
                          filteredProducts.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-gray-700">
                        {filteredProducts.length}
                      </span>{" "}
                      products
                    </p>
                  )}

                </>

              ) : (


                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">

                    <div className="mb-4 text-5xl">
                      🔍
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                      No products found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Try changing your filters
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800"
                    >
                      Clear Filters
                    </button>

                  </div>
                </div>

              )}

            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Product;