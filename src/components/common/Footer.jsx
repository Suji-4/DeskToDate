import React, { useState } from "react";
import { FaTruck, FaUndoAlt, FaLock,FaHeadset,FaFacebookF,FaInstagram,  FaYoutube, FaChevronDown,  FaPhoneAlt, FaEnvelope,FaMapMarkerAlt,} from "react-icons/fa";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const exploreLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Cart",
    href: "/cart",
  },
];

  const companyLinks = [
    {
      name: "Privacy Policy"
    },
    {
      name: "Terms & Conditions"
    },
    {
      name: "Return and Refund Policy"
    },
  ];

 

  return (
  <footer className="w-full bg-black text-white">
      <section className="  mx-auto  max-w-7xl  px-6 py-16 sm:px-8 lg:px-10 lg:py-20 "  >
        <div className=" hidden lg:grid lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:gap-14 ">
          <div className="max-w-sm">
            <div className="mb-7">
              <h2 className="text-4xl font-black tracking-tight">
                D2D
              </h2>
              <div className="mt-2 h-[3px] w-12 rounded-full bg-white" />
            </div>

            <p className="text-sm leading-7 text-white/80">
              Discover everyday essentials, stylish finds and
              thoughtful products made to bring more convenience
              and joy to your everyday life.
            </p>

            <div className="mt-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
                Follow us
              </p>
              <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className=" flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white
                    transition-all  duration-300  hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#C91F47] ">
                  <FaFacebookF />
                </a>
                <a href="#" aria-label="Instagram" className=" flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white
                    transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#C91F47] " >
                  <FaInstagram />
                </a>

                <a href="#" aria-label="Youtube" className=" flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-all
                    duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#C91F47] ">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          <div>

            <h3 className="mb-7 text-xs font-bold uppercase tracking-[0.2em]">
            Explore</h3>

            <ul className="space-y-3.5">

              {exploreLinks.map((link) => (
                <li key={link.name}>

                  <a href={link.href} className=" group flex items-center text-sm text-white/75 transition-colors duration-300 hover:text-white " >

                    <span className=" mr-2 h-[1px] w-0 bg-white transition-all duration-300  group-hover:w-3 " />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-7 text-xs font-bold uppercase tracking-[0.2em]">
              Company
            </h3>

            <ul className="space-y-3.5">

              {companyLinks.map((link) => (
                <li key={link.name}>

           <a href={link.href} className=" group flex items-center text-sm text-white/75 transition-colors duration-300 hover:text-white " >

                      <span className=" mr-2 h-[1px] w-0 bg-white transition-all duration-300  group-hover:w-3 " />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-7 text-xs font-bold uppercase tracking-[0.2em]">
              Contact Information
            </h3>
            <div className="space-y-5">

              <a href="https://wa.me/916383531622" target="_blank" rel="noopener noreferrer" className=" flex items-start gap-3 text-sm
                  text-white/80 transition-colors duration-300 hover:text-white " >
                <FaPhoneAlt className="mt-1 shrink-0 text-sm" />
                <span>
                  +91 6383531622
                </span>
              </a>

              <a href="mailto:contact@desk2date.com" target="_blank" rel="noopener noreferrer" className=" flex
                  items-start gap-3 text-sm text-white/80 transition-colors duration-300 hover:text-white" >

                <FaEnvelope className="mt-1 shrink-0 text-sm" />
                <span className="break-all">
                  desk2date@gmail.com
                </span>
              </a>

              <div className=" flex items-start gap-3 text-sm leading-6 text-white/80" >
                <FaMapMarkerAlt className="mt-1 shrink-0 text-sm" />
                <span>
                  Opposite to VIT 3rd Gate,
                  <br />
                  Katpadi, Vellore
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*  MOBILE FOOTER */}

        <div className="lg:hidden">
          <div className="mb-10">
            <h2 className="text-4xl font-black tracking-tight">
              D2D
            </h2>
            <div className="mt-2 h-[3px] w-12 rounded-full bg-white" />

            <p className="mt-5 max-w-md text-sm leading-6 text-white/80">
              Discover everyday essentials, stylish finds and
              thoughtful products made for your everyday life.
            </p>

            <div className="mt-6 flex gap-3">

              <a href="#" aria-label="Facebook" className=" flex  h-10  w-10 items-center justify-center rounded-full
                  border border-white/40 text-white transition-all duration-300 active:scale-95 ">
                <FaFacebookF />
              </a>

              <a href="#"aria-label="Instagram" className=" flex h-10 w-10 items-center justify-center rounded-full border
                  border-white/40 text-white transition-all duration-300 active:scale-95 ">
                <FaInstagram />
              </a>

              <a href="#" aria-label="Youtube" className=" flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white
                  transition-all duration-300 active:scale-95 " >
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="border-t border-white/20">
            <button onClick={() => toggleSection("shop")} className="flex w-full items-center justify-between py-5 text-left ">
             <span className="text-xs font-bold uppercase tracking-[0.18em]">
              Explore</span>

              <FaChevronDown className={` text-xs text-white/70 transition-transform duration-300
                  ${ openSection === "shop" ? "rotate-180" : "" } `} />
            </button>

            <div className={` overflow-hidden transition-all duration-300
                ${ openSection === "shop" ? "max-h-[400px] pb-5" : "max-h-0" }`} >
              <ul className="space-y-3">

                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-white/75" >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20">
            <button
              onClick={() => toggleSection("company")}
              className=" flex w-full items-center justify-between py-5 text-left " >
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Company
              </span>
              <FaChevronDown className={` text-xs text-white/70 transition-transform duration-300
                  ${  openSection === "company" ? "rotate-180" : ""  } `}/>
            </button>
            <div className={` overflow-hidden transition-all duration-300
                ${ openSection === "company" ? "max-h-[500px] pb-5" : "max-h-0"  } `}>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-white/75" >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20">

            <button onClick={() => toggleSection("contact")} className=" flex w-full items-center justify-between py-5 text-left ">
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Contact Information
              </span>
              <FaChevronDown
                className={` text-xs text-white/70 transition-transformduration-300
                  ${ openSection === "contact"  ? "rotate-180"  : "" } `}/>
            </button>
            <div className={`  overflow-hidden  transition-all  duration-300
                ${ openSection === "contact" ? "max-h-[300px] pb-5": "max-h-0"  } `} >

              <div className="space-y-5">
                <a href="https://wa.me/916383531622" target="_blank" rel="noopener noreferrer" className=" flex items-start gap-3 text-sm text-white/75 " >
                  <FaPhoneAlt className="mt-1 shrink-0" />
                  <span>
                    +91 6383531622
                  </span>

                </a>

                <a href="mailto:contact@desk2date.com" target="_blank" rel="noopener noreferrer" className=" flex  items-start  gap-3 text-sm text-white/75 " >
                  <FaEnvelope className="mt-1 shrink-0" />
                  <span className="break-all">
                    desk2date@gmail.com
                  </span>

                </a>

                <div className=" flex items-start gap-3 text-sm leading-6 text-white/75 " >
                  <FaMapMarkerAlt className="mt-1 shrink-0" />
                  <span>
                    Opposite to VIT 3rd Gate,
                    <br />
                    Katpadi, Vellore
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/20">
        <div className=" mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:px-8 md:flex-row md:text-left lg:px-10 " >
          <p className="text-xs text-white/65">
            {"\u00A9"} {new Date().getFullYear()} D2D. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/65">
            <a  className="transition-colors duration-300 hover:text-white" >  Privacy</a>
            <span className="h-3 w-px bg-white/30" />
            <a className="transition-colors duration-300 hover:text-white"> Terms </a>
            <span className="h-3 w-px bg-white/30" />
            <a className="transition-colors duration-300 hover:text-white" > Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



