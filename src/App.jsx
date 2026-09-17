import {BrowserRouter, Routes, Route} from "react-router-dom"
import MainLayout from "./components/common/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Delivery from "./pages/Delivery";
import Payment from "./pages/Payment";
import Wishlist from "./pages/Wishlist";
import "./index.css";
function App() {

  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product/>}/>
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/delivery" element={<Delivery/>}/>
        <Route path="/payment" element={<Payment/>}/>  
        <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

