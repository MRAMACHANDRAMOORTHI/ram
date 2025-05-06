import React from "react";
import image from '../assets/img/msr.jpg'
const About: React.FC = () => (
  <section id="about" className="about">
    <div className="container" data-aos="fade-up">
      <div className="row">
        {/* Image - Added object-fit and max-height constraints */}
        <div
          className="col-lg-6 order-1 order-lg-2"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          <div className="image-container h-full flex items-center justify-center overflow-hidden">
            <img 
            src={image}
              // src="/img/msr.jpg" 
              className="img-fluid max-h-96 object-cover pointer-events-none select-none" 
              onContextMenu={(e) => e.preventDefault()} 
              alt="MSR" 
            />
          </div>
        </div>
        {/* Content */}
        <div
          className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h3>Objective</h3>
          <ul className="space-y-4 text-gray-600 text-lg">
            <li>
              <i className="bi bi-briefcase-fill me-2 text-primary"></i>
              To secure a responsible career opportunity, fully utilizing my
              training and skills, while making a significant contribution to
              the success of the company.
            </li>
            <li>
              <i className="bi bi-code-slash me-2"></i>
              Passionate about building scalable and efficient web applications
              using modern technologies like React, Node.js, Java, and Spring
              Boot.
            </li>
            <li>
              <i className="bi bi-people-fill me-2 text-primary"></i>
              Eager to apply my strong problem-solving, teamwork, and project
              management skills in a dynamic environment.
            </li>
            <li>
              <i className="bi bi-book me-2"></i>
              Continuously learning and adapting to the latest industry trends,
              aiming for both personal and organizational growth.
            </li>
            {/* <li>
              <i className="bi bi-patch-check-fill me-2 text-primary"></i>
              Dedicated to delivering high-quality software solutions, following
              security best practices and clean coding standards.
            </li> */}
            <li>
              <i className="bi bi-graph-up me-2"></i>
              Committed to continuous personal and professional development,
              striving to master emerging technologies and contribute
              meaningfully to innovative projects.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default About;