// src/components/Footer.tsx
import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section - R is warn color */}
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-3xl font-bold tracking-wider">
              <span className="text-white">M</span>
              <span className="text-white">S</span>
              <span className="text-yellow-500">R</span>
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Software Engineer building scalable, user-centric solutions with
              Elixir, Phoenix, and React.
            </p>
          </div>

          {/* Quick Links - Hover warn color */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Home", href: "#hero" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links - Blue accents changed to warn */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-6 text-white">Connect</h4>
            <div className="flex justify-center md:justify-end gap-6">
              <a
                href="https://github.com/MRAMACHANDRAMOORTHI"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/ramachandramoorthi"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/ramachandramoorthi_m"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="mailto:mrcmoorthi@gmail.com"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Ramachandramoorthi M. All rights
            reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Designed & Built with <span className="text-red-500">♥</span> by
            <a
              href="https://linkedin.com/in/ramachandramoorthi/"
              target="_blank"
              rel="noreferrer"
              className="text-yellow-500 hover:text-yellow-400 font-medium ml-1"
            >
              Ramachandramoorthi
            </a>
          </p>
        </div>
      </div>

      {/* Scroll to Top Button - Warn background, black icon */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center shadow-xl focus:outline-none transition-transform hover:-translate-y-1 z-40"
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
