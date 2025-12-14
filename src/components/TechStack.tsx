import React from "react";

const techData = [
  // --- CURRENT PRIMARY STACK (Ardhika) ---
  {
    icon: "bi bi-droplet-fill", // Represents Elixir (liquid/drop)
    title: "Elixir",
    description:
      "My core language for backend engineering. I use functional programming and OTP to build fault-tolerant, scalable workflow engines for the Helpdesk system.",
    link: "https://elixir-lang.org/",
  },
  {
    icon: "bi bi-fire", // Represents Phoenix
    title: "Phoenix Framework",
    description:
      "Architecting high-performance web applications. Currently using Phoenix to manage ticket lifecycles, SLA timers, and background jobs.",
    link: "https://www.phoenixframework.org/",
  },
  {
    icon: "bi bi-layers-fill", // Represents Vue Components
    title: "Vue.js (Vue 3)",
    description:
      "Building the frontend for the Sastra LMS Helpdesk using Vue 3 and Composition API to create reactive dashboards and interactive ticket views.",
    link: "https://vuejs.org/",
  },
  {
    icon: "bi bi-database-check",
    title: "PostgreSQL & Ecto",
    description:
      "Designing complex database schemas and using Ecto ORM for efficient data aggregation to power real-time analytics and reporting.",
    link: "https://www.postgresql.org/",
  },

  // --- PREVIOUS EXPERIENCE & FOUNDATION (CICT / Retech) ---
  {
    icon: "bi bi-filetype-json",
    title: "React.js",
    description:
      "Developed the CICT E-learning portal using React. Experienced with Hooks, Context API, and integrating Firebase for real-time data.",
    link: "https://reactjs.org/",
  },
  {
    icon: "bi bi-filetype-tsx",
    title: "TypeScript",
    description:
      "Applied TypeScript in React and Node.js projects to ensure type safety and cleaner, scalable code — utilized extensively in the CICT portal.",
    link: "https://www.typescriptlang.org/",
  },
  {
    icon: "bi bi-filetype-js",
    title: "JavaScript",
    description:
      "Strong command of ES6+ features, utilized across both my Vue.js current work and previous React/Node.js projects.",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    icon: "bi bi-filetype-java",
    title: "Java",
    description:
      "Strong academic foundation and internship experience building enterprise backend logic and REST APIs using Java.",
    link: "https://www.java.com/en/",
  },
  {
    icon: "bi bi-bootstrap",
    title: "Spring Boot",
    description:
      "Experience building RESTful APIs and optimizing backend performance during my internship at RETECH Solutions.",
    link: "https://spring.io/projects/spring-boot",
  },

  // --- TOOLS & CONCEPTS ---
  {
    icon: "bi bi-diagram-2",
    title: "System Design",
    description:
      'Applied system design principles to architect the Helpdesk "Round Robin" assignment logic and scalable database structures.',
    link: "https://github.com/donnemartin/system-design-primer",
  },
  {
    icon: "bi bi-git",
    title: "Git & GitHub",
    description:
      "Daily usage for version control, branching strategies, and team collaboration across distributed agile environments.",
    link: "https://git-scm.com/",
  },
  {
    icon: "bi bi-hdd-network",
    title: "RESTful APIs",
    description:
      " extensive experience designing and consuming REST APIs for smooth client-server communication in both Elixir and Java environments.",
    link: "https://restfulapi.net/",
  },
];

const TechStack: React.FC = () => (
  <section id="skills" className="prg">
    <div className="container" data-aos="fade-up">
      <div className="section-title">
        <h2>Skills</h2>
        <p>Programming Languages & Tools</p>
      </div>

      <div className="row">
        {techData.map((tech, index) => (
          <div
            key={index}
            className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4"
            data-aos="zoom-in"
            data-aos-delay={100 + index * 100}
          >
            <div className="icon-box">
              <div className="icon">
                <i className={tech.icon}></i>
              </div>
              <h4>
                <a href={tech.link} target="_blank" rel="noopener noreferrer">
                  {tech.title}
                </a>
              </h4>
              <p>{tech.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStack;
