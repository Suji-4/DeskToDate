import React from 'react'
import Hero from "../components/home/Hero"
import Offers from '../components/home/Offers'
import Category from "../components/home/Category"
import AccCategory from "../components/home/AccCategory"
import ProductItem from '../components/home/productsection/ProductItem'
import CtaSection from "../components/home/CtaSection"
const Home = () => {
  return (
    <div>
        <Hero/>
        <Offers/>
        <Category/>
        <CtaSection/>
        <AccCategory/>
        <ProductItem/>
     
        
    </div>
  )
}

export default Home