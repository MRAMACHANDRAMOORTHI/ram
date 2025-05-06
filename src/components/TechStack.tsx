import React from 'react';


const techData = [
  {
    
    icon: 'bi bi-filetype-java',
    title: 'Java',
    description:
      'Strongly built my Java foundation through academic courses, NPTEL certification, and hands-on backend projects using Spring Boot.',
    link: 'https://www.java.com/en/',
  },
  {
    icon: 'bi bi-bootstrap',
    title: 'Spring Boot',
    description:
      'Worked on building RESTful APIs and backend logic using Spring Boot during my internship and academic projects like HealthChain and ScholarSphere.',
    link: 'https://spring.io/projects/spring-boot',
  },
  {
    icon: 'bi bi-filetype-js',
    title: 'JavaScript',
    description:
      'Used JavaScript extensively in frontend development for dynamic interactivity in projects like the Learning Portal and mini React apps.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    icon: 'bi bi-filetype-tsx',
    title: 'TypeScript',
    description:
      'Applied TypeScript in React and Node.js projects to ensure type safety and cleaner, scalable code — especially in Firebase-integrated apps.',
    link: 'https://www.typescriptlang.org/docs/',
  },
  {
    icon: 'bi bi-filetype-json',
    title: 'React.js',
    description:
      'Gained deep experience building responsive and modular UIs using React, including advanced Router and Firebase integrations.',
    link: 'https://reactjs.org/docs/getting-started.html',
  },
  {
    icon: 'bi bi-fire',
    title: 'Firebase',
    description:
      'Used Firebase for user authentication and real-time database in projects like the Learning Portal, focusing on secure and live data handling.',
    link: 'https://firebase.google.com/docs',
  },
  {
    icon: 'bi bi-database-fill-gear',
    title: 'MySQL',
    description:
      'Experienced in writing optimized queries, designing schemas, and managing data flow in MySQL across major backend projects.',
    link: 'https://dev.mysql.com/doc/',
  },
  {
    icon: 'bi bi-hdd-network',
    title: 'RESTful APIs',
    description:
      'Built and consumed RESTful APIs using Spring Boot and Node.js to enable smooth client-server communication in full-stack applications.',
    link: 'https://restfulapi.net/',
  },
  {
    icon: 'bi bi-diagram-3-fill',
    title: 'OOP & OOAD',
    description:
      'Practiced Object-Oriented Programming principles and Object-Oriented Analysis & Design in Java and project architecture design.',
    link: 'https://www.geeksforgeeks.org/object-oriented-design-ooad/',
  },
  {
    icon: 'bi bi-diagram-2',
    title: 'System Design',
    description:
      'Self-learned and applied system design principles to structure scalable apps with a focus on clean architecture, databases, and APIs.',
    link: 'https://www.educative.io/courses/grokking-the-system-design-interview',
  },
  {
    icon: 'bi bi-git',
    title: 'Git & GitHub',
    description:
      'Used Git and GitHub for version control and team collaboration in all my projects and internship, ensuring clean code history and issue tracking.',
    link: 'https://git-scm.com/doc',
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
