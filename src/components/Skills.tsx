import React from "react";
import features from "../assets/img/convo.jpg"; // Adjust the path as necessary

const Skills: React.FC = () => (
  <section id="pers-skills" className="skills section-bg">
    <div className="container" data-aos="fade-up">
      <div className="row align-items-center">
        {/* LEFT SIDE: Image */}
        <div
          className="col-lg-6 d-flex justify-content-center"
          data-aos="fade-right"
        >
          <img
            src={features}
            alt="My Skills"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "650px", objectFit: "contain" }}
          />
        </div>

        {/* RIGHT SIDE: Skills List */}
        <div
          className="col-lg-6 pt-4 pt-lg-0 content"
          data-aos="fade-left"
          data-aos-delay="150"
        >
          {[
            {
              icon: "bi bi-tools",
              title: "Problem Solving",
              text: "Analysis, Logical reasoning, Observation, Brainstorming, Decision making.",
            },
            {
              icon: "bi bi-option",
              title: "Work Ethic",
              text: "Responsibility, Discipline, Dependability, Commitment, Professionalism.",
            },
            {
              icon: "bi bi-journal-check",
              title: "Communication",
              text: "Verbal communication, Written communication, Presentation, Feedback, Listening.",
            },
            {
              icon: "bi bi-people",
              title: "Interpersonal Skills",
              text: "Empathy, Humor, Networking, Tolerance, Diplomacy.",
            },
            {
              icon: "bi bi-person-hearts",
              title: "Team Work",
              text: "Collaboration, Mediation, Conflict management, Coordination, Idea exchange.",
            },
            {
              icon: "bi bi-watch",
              title: "Time Management",
              text: "Planning, Organization, Prioritizing, Goal setting, Stress management.",
            },
            // --- NEW SKILLS ADDED BELOW ---
            {
              icon: "bi bi-arrows-move",
              title: "Adaptability",
              text: "Flexibility, Resilience, Continuous learning, Agile mindset, Open-mindedness.",
            },
            {
              icon: "bi bi-lightbulb",
              title: "Creativity",
              text: "Innovation, Curiosity, Originality, Resourcefulness, Vision.",
            },
          ].map(({ icon, title, text }, idx) => (
            // d-flex aligns icon and text side-by-side
            <div
              className="d-flex align-items-start mt-4"
              data-aos="zoom-in"
              data-aos-delay="150"
              key={idx}
            >
              <div className="icon-box me-3">
                <i
                  className={icon}
                  style={{ fontSize: "32px", color: "#FF6700", lineHeight: 1 }}
                ></i>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "5px",
                    color: "#333",
                  }}
                >
                  {title}
                </h4>
                <p style={{ fontSize: "15px", color: "#848484", margin: 0 }}>
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
