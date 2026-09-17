import React, { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProductCard from "../../../components/home/productsection/ProductCard";

const ProductItem = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
 

  const homeProducts = useMemo(() => { 
    return products.slice(0, 8); 
  }, [products]); 
 
const categories = useMemo(() => {
  const uniqueCategories = [
    ...new Map(
      products
        .map((product) => product.category?.trim())
        .filter(Boolean)
        .map((category) => [category.toLowerCase(), category])
    ).values(),
  ];

  return ["All", ...uniqueCategories];
}, [products]);

const filteredProducts = useMemo(() => {
  if (activeCategory === "All") {
    return homeProducts;
  }

  return homeProducts.filter(
    (product) =>
      product.category?.trim().toLowerCase() ===
      activeCategory.toLowerCase()
  );
}, [activeCategory, homeProducts]);
 
  const handleCategoryChange = (category) => { 
    setActiveCategory(category); 
    setCurrentPage(0); 
  }; 
 
  const productsPerPage = 8; 
 
  const totalPages = Math.ceil( 
    filteredProducts.length / productsPerPage 
  ); 
 
  const visibleProducts = filteredProducts.slice( 
    currentPage * productsPerPage, 
    currentPage * productsPerPage + productsPerPage 
  ); 
 
  const handleProductClick = (id) => { 
    navigate(`/products/${id}`); 
  }; 
 
  const handleViewAll = () => { 
    navigate("/products"); 
  };  
 
  const handlePrevious = () => { 
    if (currentPage > 0) { 
      setCurrentPage((page) => page - 1); 
    } 
  }; 
 
  const handleNext = () => { 
    if (currentPage < totalPages - 1) { 
      setCurrentPage((page) => page + 1); 
    } 
  }; 
 
  return ( 
    <section className="w-full bg-[#F8FAF9] px-4 py-14 sm:px-6 lg:px-8"> 
      <div className="mx-auto max-w-7xl"> 
 
        {/* HEADING */} 
 
        <div className="mb-8 text-center"> 
          <h2 className="text-[28px] font-bold tracking-[-0.033em] text-[#18312E] sm:text-[34px]"> 
            Shop by Category 
          </h2> 
 
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#7A827E]"> 
            Explore our carefully selected collection of everyday essentials, 
            playful finds and beautiful home pieces. 
          </p> 
        </div> 
 
        {/* CATEGORIES */} 
 
        <div className="relative mb-10 flex items-center justify-center"> 
          <div className="flex max-w-[85%] gap-7 overflow-x-auto scrollbar-hide"> 
 
            {categories.map((category) => { 
              const isActive = activeCategory === category; 
 
              return ( 
                <button 
                  key={category} 
                  type="button" 
                  onClick={() => handleCategoryChange(category)} 
                  className={`group relative shrink-0 pb-2 text-[12px] font-semibold transition-all duration-300 ${ 
                    isActive 
                      ? "text-[#0F766E]" 
                      : "text-[#7A827E] hover:text-[#18312E]" 
                  }`} 
                > 
                  {category} 
 
                  <span 
                    className={`absolute bottom-0 left-0 h-[1.5px] rounded-full bg-[#0F766E] transition-all duration-300 ${ 
                      isActive 
                        ? "w-full" 
                        : "w-0 group-hover:w-full" 
                    }`} 
                  /> 
                </button> 
              ); 
            })} 
 
          </div> 
 
          {/* VIEW ALL */} 
 
          <button 
            type="button" 
            onClick={handleViewAll} 
            className="absolute right-0 shrink-0 whitespace-nowrap text-[12px] font-semibold text-[#0F766E] transition-all duration-300 hover:text-[#18312E]" 
          > 
            View All → 
          </button> 
        </div> 
 
        {/* LOADING */} 
 
        {loading ? ( 
          <div className="flex min-h-[300px] items-center justify-center"> 
            <p className="text-[14px] font-medium text-[#7A827E]"> 
              Loading products... 
            </p> 
          </div> 
        ) : visibleProducts.length > 0 ? ( 
 
          /* PRODUCTS */ 
 
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> 
            {visibleProducts.map((product) => ( 
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={handleProductClick} 
              /> 
            ))} 
          </div> 
 
        ) : ( 
 
          /* NO PRODUCTS */ 
 
          <div className="flex min-h-[300px] items-center justify-center rounded-[24px] border border-dashed border-[#D8E2DE] bg-white"> 
            <div className="text-center"> 
              <p className="text-[14px] font-semibold text-[#18312E]"> 
                No products found 
              </p> 
 
              <p className="mt-1 text-[12px] text-[#89938F]"> 
                Try selecting another category. 
              </p> 
            </div> 
          </div> 
        )} 
 
        {/* PAGINATION */} 
 
        {!loading && totalPages > 1 && ( 
          <div className="mt-10 flex items-center justify-center gap-2"> 
 
            {/* PREVIOUS */} 
 
            <button 
              type="button" 
              onClick={handlePrevious} 
              disabled={currentPage === 0} 
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E2DE] bg-white text-[#18312E] transition-all duration-300 
              hover:border-[#0F766E] hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40" 
            > 
              <FaChevronLeft className="text-[11px]" /> 
            </button> 
 
            {/* PAGE NUMBERS */} 
 
            {Array.from({ length: totalPages }).map((_, index) => ( 
              <button 
                key={index} 
                type="button" 
                onClick={() => setCurrentPage(index)} 
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-300 ${ 
                  currentPage === index 
                    ? "bg-[#0F766E] text-white" 
                    : "border border-[#D8E2DE] bg-white text-[#18312E] hover:border-[#0F766E] hover:text-[#0F766E]" 
                }`} 
              > 
                {index + 1} 
              </button> 
            ))} 
 
            {/* NEXT */} 
 
            <button 
              type="button" 
              onClick={handleNext} 
              disabled={currentPage === totalPages - 1} 
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E2DE] bg-white text-[#18312E] transition-all duration-300
               hover:border-[#0F766E] hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40" 
            > 
              <FaChevronRight className="text-[11px]" /> 
            </button> 
 
          </div> 
        )} 
 
      </div> 
    </section> 
  ); 
}; 
 
export default ProductItem;  