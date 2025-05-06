// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const Header: React.FC = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileNav = () => setMobileNav(prev => !prev);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
  id="header"
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-auto py-1 ${
    scrolled ? 'bg-black/90 shadow-md' : 'bg-transparent'
  } ${mobileNav ? 'bg-black' : ''}`}
>
  <div className="container mx-auto flex items-center justify-between px-8 py-2">
    {/* Logo */}
    <h1 className="text-xl md:text-2xl font-bold text-white m-0">
      <HashLink smooth to="/#hero" onClick={() => setMobileNav(false)}>
        MS<span className="text-yellow-400">R</span>
      </HashLink>
    </h1>

    {/* Mobile Toggle */}
    <button
      onClick={toggleMobileNav}
      className="text-white text-2xl md:hidden focus:outline-none"
    >
      <i className={`bi ${mobileNav ? 'bi-x' : 'bi-list'}`}></i>
    </button>

    {/* Navigation */}
    <nav
      className={`${
        mobileNav
          ? 'absolute top-full left-0 w-full bg-black flex flex-col gap-3 p-4 md:hidden'
          : 'hidden md:flex md:items-center md:gap-6'
      }`}
    >
      {[
        { label: 'Home', href: '/#hero' },
        { label: 'Education', href: '/#counts' },
        { label: 'Experience', href: '/#experience' },
        { label: 'Projects', href: '/#projects' },
        { label: 'Skills', href: '/#skills' },
        { label: 'Contact', href: '/#contact' },
      ].map((item, idx) => (
        <HashLink
          key={idx}
          smooth
          to={item.href}
          className="text-white transition duration-300 ease-in-out hover:text-yellow-400"
          onClick={() => setMobileNav(false)}
        >
          {item.label}
        </HashLink>
      ))}
    </nav>

    {/* Get Started */}
    <div className="hidden md:block">
      <HashLink
        smooth
        to="/#about"
        className="text-yellow-400 text-sm border border-yellow-400 px-4 py-1 rounded hover:bg-yellow-400 hover:text-black transition-all"
      >
        Get Started
      </HashLink>
    </div>
  </div>
</header>
  );
};

export default Header;
