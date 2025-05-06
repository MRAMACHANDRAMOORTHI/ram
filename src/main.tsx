

import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './index.css'
import './style.css'
import App from './App';

import 'swiper/css';
import 'swiper/css/pagination';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'aos/dist/aos.css';
import 'glightbox/dist/css/glightbox.css';

import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';
import Isotope from 'isotope-layout';
import AOS from 'aos';
import GLightbox from 'glightbox';
import PureCounter from '@srexi/purecounterjs';
import React from 'react';

// Define the initialization function to be called after components mount
window.initGpTemplate = () => {
  // JS initializations
  new Swiper('.clients-slider', { 
    modules: [Navigation, Pagination],
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 40 },
      480: { slidesPerView: 3, spaceBetween: 60 },
      640: { slidesPerView: 4, spaceBetween: 80 },
      992: { slidesPerView: 6, spaceBetween: 120 }
    }
  });

  new Swiper('.portfolio-details-slider', {
    modules: [Pagination],
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  new Swiper('.testimonials-slider', {
    modules: [Pagination],
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  // Initialize Isotope
  const portfolioContainer = document.querySelector('.portfolio-container');
  if (portfolioContainer) {
    const iso = new Isotope(portfolioContainer, {
      itemSelector: '.portfolio-item'
    });

    // Filter items on button click
    document.querySelectorAll('.portfolio-filters li').forEach(filter => {
      filter.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.portfolio-filters .filter-active')?.classList.remove('filter-active');
        filter.classList.add('filter-active');
        iso.arrange({
          filter: filter.getAttribute('data-filter')
        });
      });
    });
  }

  // Initialize AOS
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // Initialize GLightbox
  GLightbox({
    selector: '.portfolio-lightbox'
  });

  // Initialize PureCounter
  new PureCounter();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>
);
