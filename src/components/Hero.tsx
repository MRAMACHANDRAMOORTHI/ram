import React from 'react';
import heroBg from '../assets/img/hero-bg.jpg'; // Adjust the path as necessary

const Hero: React.FC = () => (
  <section id="hero" className="d-flex align-items-center justify-content-center"  style={{ backgroundImage: `url(${heroBg})` }}>
    <div className="container" data-aos="fade-up">

      <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="150">
        <div className="col-xl-6 col-lg-8 text-center">
          <h1>RAMACHANDRAMOORTHI <span>MUNIYAPPAN</span></h1>
         
          <h2>MCA</h2>
          <h2 >Full Stack Developer</h2>
        </div>
      </div>

      <div className="row gy-4 mt-5 justify-content-center" data-aos="zoom-in" data-aos-delay="250">
        <div className="col-xl-2 col-md-4">
          <div className="icon-box">
            <i className="bi bi-mortarboard-fill"></i>
            <h3>
              <a className="scrollto active" href="#counts">
                Education
              </a>
            </h3>
          </div>
        </div>

        <div className="col-xl-2 col-md-4">
          <div className="icon-box">
          <i className="bi bi-hearts"></i>
            <h3>
              <a className="scrollto" href="#experience">
                Experience
              </a>
            </h3>
          </div>
        </div>

        <div className="col-xl-2 col-md-4">
          <div className="icon-box">
          <i className="bi bi-motherboard-fill"></i>
            <h3>
              <a className="scrollto" href="#projects">
                projects
              </a>
            </h3>
          </div>
        </div>

        <div className="col-xl-2 col-md-4">
          <div className="icon-box">
            <i className="bi bi-telephone-fill"></i>
            <h3>
              <a className="scrollto" href="#contact">
                Contact
              </a>
            </h3>
          </div>
        </div>

        <div className="col-xl-2 col-md-4">
          <div className="icon-box">
            <i className="bi bi-tools"></i>
            <h3>
              <a className="scrollto" href="#skills">
                Skills
              </a>
            </h3>
          </div>
        </div>
      </div>

    </div>
  </section>
);

export default Hero;
