import React from "react";

const Navbar: React.FC = () => (
  <header id="header" className="fixed-top">
    <div className="container d-flex align-items-center justify-content-lg-between">
      <h1 className="logo me-auto me-lg-0">
        <a href="#hero">
          MS<span>R</span>
        </a>
      </h1>

      <nav id="navbar" className="navbar order-last order-lg-0">
        <ul>
          <li>
            <a
              className="nav-link scrollto nav-link  text-white hover:text-yellow-400 transition-colors duration-300 active "
              href="#hero"
            >
              Home
            </a>
          </li>
          <li>
            <a
              className="nav-link scrollto text-white hover:text-yellow-400 transition-all duration-300"
              href="#Education"
            >
              Education
            </a>
          </li>
          <li>
            <a
              className="nav-link scrollto nav-link  text-white hover:text-yellow-400 transition-colors duration-300"
              href="#skills"
            >
              Skills
            </a>
          </li>
          <li>
            <a
              className="nav-link scrollto nav-link text-white hover:text-yellow-400 transition-colors duration-300"
              href="#projects"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              className="nav-link scrollto nav-link scrollto text-white hover:text-yellow-400 transition-colors duration-300"
              href="#experience"
            >
              Experience
            </a>
          </li>
          <li>
            <a
              className="nav-link scrollto nav-link scrollto text-white hover:text-yellow-400 transition-colors duration-300"
              href="#contact"
            >
              Contact
            </a>
          </li>
        </ul>
        <i className="bi bi-list mobile-nav-toggle"></i>
      </nav>

      <a href="#about" className="get-started-btn scrollto">
        Get Started
      </a>
    </div>
  </header>
);

export default Navbar;
