// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";

const Header: React.FC = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileNav = () => setMobileNav((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Education", href: "/#Education" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3 ${
        scrolled
          ? "bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800"
          : "bg-transparent"
      } ${mobileNav ? "bg-gray-900" : ""}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        {/* Logo - R is warn color */}
        <h1 className="text-2xl font-bold text-white m-0 tracking-wider">
          <HashLink
            smooth
            to="/#hero"
            onClick={() => setMobileNav(false)}
            className="flex items-center gap-1 group"
          >
            <span className="text-white group-hover:text-yellow-500 transition-colors">
              M
            </span>
            <span className="text-white group-hover:text-yellow-500 transition-colors">
              S
            </span>
            <span className="text-yellow-500 group-hover:text-white transition-colors">
              R
            </span>
          </HashLink>
        </h1>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileNav}
          className="text-white text-2xl md:hidden focus:outline-none hover:text-yellow-500 transition-colors"
          aria-label="Toggle navigation"
        >
          <i className={`bi ${mobileNav ? "bi-x-lg" : "bi-list"}`}></i>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item, idx) => (
            <HashLink
              key={idx}
              smooth
              to={item.href}
              // Added hover:text-yellow-500 for the warn color on hover
              className="text-white font-bold text-sm uppercase tracking-wide transition duration-300 ease-in-out hover:text-yellow-500 hover:scale-105"
            >
              {item.label}
            </HashLink>
          ))}
        </nav>

        {/* Mobile Navigation Menu */}
        <nav
          className={`${
            mobileNav
              ? "absolute top-full left-0 w-full bg-gray-900 border-t border-gray-800 flex flex-col p-6 shadow-xl md:hidden"
              : "hidden"
          }`}
        >
          {navLinks.map((item, idx) => (
            <HashLink
              key={idx}
              smooth
              to={item.href}
              className="text-white font-bold text-lg py-3 border-b border-gray-800 last:border-0 hover:text-yellow-500 transition-colors"
              onClick={() => setMobileNav(false)}
            >
              {item.label}
            </HashLink>
          ))}
        </nav>

        {/* CTA Button - Updated to White Text */}
        <div className="hidden md:block">
          <HashLink
            smooth
            to="/#contact"
            // Changed text-gray-900 to text-white
            className="px-5 py-2 rounded-full bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
          >
            Let's Talk
          </HashLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
