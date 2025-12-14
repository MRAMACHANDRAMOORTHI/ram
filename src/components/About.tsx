import React from "react";
import image from "../assets/img/moorthi.png";

const About: React.FC = () => (
  <section id="about" className="about">
    <div className="container" data-aos="fade-up">
      {/* align-items-stretch ensures both columns are exactly the same height */}
      <div className="row align-items-stretch">
        {/* Image Column */}
        <div
          className="col-lg-6 order-1 order-lg-2"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          {/* h-100 ensures the div takes full height of the parent row */}
          <div className="h-100 w-full flex items-center justify-center overflow-hidden pointer-events-none select-none">
            <img
              src={image}
              // h-full and object-cover ensure the image fills the height without distortion
              className="img-fluid w-full h-full object-cover"
              onContextMenu={(e) => e.preventDefault()}
              alt="MSR"
              style={{ minHeight: "400px" }} // Ensures image doesn't get too small on mobile
            />
          </div>
        </div>

        {/* Content Column */}
        <div
          className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content d-flex flex-column justify-content-center"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h3>Summary</h3>
          <ul className="space-y-4 text-gray-600 text-lg">
            <li>
              <i className="bi bi-briefcase-fill me-2 text-primary"></i>
              Software Engineer specializing in functional programming with{" "}
              <strong>Elixir</strong> and <strong>Phoenix Framework</strong>,
              building scalable backend architectures.
            </li>
            <li>
              <i className="bi bi-code-slash me-2"></i>
              Currently leading the development of complex Helpdesk systems for
              large-scale EdTech platforms, handling critical admission and fee
              workflows.
            </li>
            <li>
              <i className="bi bi-graph-up me-2 text-primary"></i>
              Proficient in designing efficient <strong>PostgreSQL</strong>{" "}
              schemas and developing real-time, reactive user interfaces with{" "}
              <strong>Vue3.js</strong>.
            </li>

            {/* New Extra Point 1: Technical Depth */}
            <li>
              <i className="bi bi-database-fill-gear me-2"></i>
              Experienced in optimizing database performance using Ecto
              aggregations and implementing automated workflow engines that
              streamline business processes and reduce manual intervention.
            </li>

            {/* New Extra Point 2: Soft Skills/Growth */}
            <li>
              <i className="bi bi-people-fill me-2 text-primary"></i>
              Dedicated to delivering high-performance, user-centric
              applications in distributed agile environments. I am passionate
              about continuous learning, adapting to emerging technologies, and
              contributing to the long-term success of the organization.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default About;
