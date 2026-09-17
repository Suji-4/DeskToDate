import puzzle from "../../../assets/images/puzzle.avif";
import toycar from "../../../assets/images/toycar.avif";
import toy from "../../../assets/images/toy.avif";
import musictoy from "../../../assets/images/musictoy.avif";
import drawing from "../../../assets/images/drawing.avif";
import puzzle2 from "../../../assets/images/puzzle2.avif";

import toyclose from "../../../assets/images/toyclose.jpg";
import toyback from "../../../assets/images/toyback.jpg";
import toyfront from "../../../assets/images/toyfront.jpg";
import toyfull from "../../../assets/images/toyfull.png";

import toycarclose from "../../../assets/images/toycarclose.png";
import toycarfull from "../../../assets/images/toycarfull.jpg";
import toycarfront from "../../../assets/images/toycarfront.jpg";
import toycarback from "../../../assets/images/toycarback.jpg";

import girldress from "../../../assets/images/girldress.avif";
import boydress from "../../../assets/images/boydress.avif";
import girldress1 from "../../../assets/images/girldress1.avif";
import girldress2 from "../../../assets/images/girldress2.avif";
import boydress1 from "../../../assets/images/boydress1.avif";
import boydress2 from "../../../assets/images/boydress2.avif";

import homedecor from "../../../assets/images/homedecor.avif";
import homedecor1 from "../../../assets/images/homedecor1.avif";
import homedecor2 from "../../../assets/images/homedecor2.avif";
import homedecor3 from "../../../assets/images/homedecor3.avif";
import homedecor4 from "../../../assets/images/homedecor4.avif";
import homedecor5 from "../../../assets/images/homedecor5.avif";

import stationary from "../../../assets/images/stationary.avif";
import stationary1 from "../../../assets/images/stationary1.avif";
import stationary2 from "../../../assets/images/stationary2.avif";
import stationary3 from "../../../assets/images/stationary3.avif";
import stationary4 from "../../../assets/images/stationary4.avif";
import stationary5 from "../../../assets/images/stationary5.avif";

export const categories = [
  "All",
  "Toys",
  "Baby Dress",
  "Home Decor",
  "Stationary",
];

export const products = [
  {
    id: 1,
    name: "Colorful Wooden Building Blocks",
    category: "Toys",
    subcategory: "Kids Toys",
    price: 499,
    rating: 4.8,
    discount: 10,
    image: toy,
    images: [toy, toyfront, toyback, toyclose, toyfull],
  },

  {
    id: 2,
    name: "Creative Kids Toy Collection",
    category: "Toys",
    subcategory: "RC Cars",
    price: 699,
    rating: 4.7,
    discount: 15,
    image: toycar,
    images: [toycar, toycarfront, toycarback, toycarclose, toycarfull],
  },

  {
    id: 3,
    name: "Premium Hardcover Notebook",
    category: "Stationary",
    subcategory: "Notebooks",
    price: 299,
    rating: 4.8,
    discount: 10,
    image: stationary,
  },

  {
    id: 4,
    name: "Soft Cotton Girls Dress",
    category: "Baby Dress",
    subcategory: "Baby Girls",
    price: 799,
    rating: 4.9,
    discount: 20,
    image: girldress,
  },

  {
    id: 5,
    name: "Comfortable Boys Summer Outfit",
    category: "Baby Dress",
    subcategory: "Baby Boys",
    price: 899,
    rating: 4.7,
    discount: 15,
    image: boydress,
  },

  {
    id: 6,
    name: "Minimal Desk Stationery Set",
    category: "Stationary",
    subcategory: "Writing Accessories",
    price: 449,
    rating: 4.7,
    discount: 15,
    image: stationary2,
  },

  {
    id: 7,
    name: "Minimal Ceramic Decorative Vase",
    category: "Home Decor",
    subcategory: "Home Accessories",
    price: 599,
    rating: 4.8,
    discount: 10,
    image: homedecor,
  },

  {
    id: 8,
    name: "Modern Home Decorative Lamp",
    category: "Home Decor",
    subcategory: "Home Accessories",
    price: 1299,
    rating: 4.9,
    discount: 15,
    image: homedecor1,
  },

  {
    id: 9,
    name: "Elegant Ceramic Home Accent",
    category: "Home Decor",
    subcategory: "Home Accessories",
    price: 849,
    rating: 4.7,
    discount: 12,
    image: homedecor2,
  },

  {
    id: 10,
    name: "Colorful Educational Toy Set",
    category: "Toys",
    subcategory: "Educational Toys",
    price: 549,
    rating: 4.6,
    discount: 12,
    image: puzzle,
  },

  {
    id: 11,
    name: "Premium Kids Everyday Wear",
    category: "Baby Dress",
    subcategory: "Baby Sets",
    price: 749,
    rating: 4.8,
    discount: 18,
    image: girldress1,
  },

  {
    id: 12,
    name: "Creative Writing Notebook Set",
    category: "Stationary",
    subcategory: "Notebooks",
    price: 399,
    rating: 4.9,
    discount: 20,
    image: stationary1,
  },

  {
    id: 13,
    name: "Kids Musical Learning Toy",
    category: "Toys",
    subcategory: "Educational Toys",
    price: 799,
    rating: 4.7,
    discount: 15,
    image: musictoy,
  },

  {
    id: 14,
    name: "Painting and Drawing Art Set for Kids",
    category: "Toys",
    subcategory: "Educational Toys",
    price: 649,
    rating: 4.6,
    discount: 12,
    image: drawing,
  },

  {
    id: 15,
    name: "Premium Wooden Puzzle Set",
    category: "Toys",
    subcategory: "Kids Toys",
    price: 999,
    rating: 4.8,
    discount: 20,
    image: puzzle2,
  },

  {
    id: 16,
    name: "Floral Cotton Girls Dress",
    category: "Baby Dress",
    subcategory: "Baby Girls",
    price: 849,
    rating: 4.8,
    discount: 15,
    image: girldress2,
  },

  {
    id: 17,
    name: "Comfort Fit Boys Casual Wear",
    category: "Baby Dress",
    subcategory: "Baby Boys",
    price: 949,
    rating: 4.7,
    discount: 18,
    image: boydress1,
  },

  {
    id: 18,
    name: "Kids Premium Party Dress",
    category: "Baby Dress",
    subcategory: "Baby Boys",
    price: 1099,
    rating: 4.9,
    discount: 20,
    image: boydress2,
  },

  {
    id: 19,
    name: "Elegant Ceramic Table Decor",
    category: "Home Decor",
    subcategory: "Home Accessories",
    price: 699,
    rating: 4.6,
    discount: 10,
    image: homedecor3,
  },

  {
    id: 20,
    name: "Modern Decorative Table Lamp",
    category: "Home Decor",
    subcategory: "Home Accessories",
    price: 1499,
    rating: 4.8,
    discount: 15,
    image: homedecor4,
  },

  {
    id: 21,
    name: "Minimal Ceramic Home Accent",
    category: "Home Decor",
    subcategory: "Home Accessories",
    price: 899,
    rating: 4.7,
    discount: 12,
    image: homedecor5,
  },

  {
    id: 22,
    name: "Daily Planner Hardcover Notebook",
    category: "Stationary",
    subcategory: "Notebooks",
    price: 349,
    rating: 4.7,
    discount: 10,
    image: stationary3,
  },

  {
    id: 23,
    name: "Pen Stationery Kit",
    category: "Stationary",
    subcategory: "Pen",
    price: 549,
    rating: 4.8,
    discount: 15,
    image: stationary4,
  },

  {
    id: 24,
    name: "Creative Notes Writing Set",
    category: "Stationary",
    subcategory: "Writing Accessories",
    price: 449,
    rating: 4.9,
    discount: 20,
    image: stationary5,
  },
];