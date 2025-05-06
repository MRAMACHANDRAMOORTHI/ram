import React from 'react';
import features from '../assets/img/features.jpg'; // Adjust the path as necessary

const Skills: React.FC = () => (
  <section id="pers-skills" className="skills">
    <div className="container" data-aos="fade-up">
      <div className="row">
        <div
          className="image col-lg-6"
          style={{ backgroundImage: `url(${features})` }}
          data-aos="fade-right"
        ></div>

        <div className="col-lg-6" data-aos="fade-left" data-aos-delay="150">
          {[
            {
              icon: 'bi bi-tools',
              title: 'Problem Solving',
              text: 'Analysis, Logical reasoning, Observation, Brainstorming, Decision making.',
            },
            {
              icon: 'bi bi-option',
              title: 'Work Ethic',
              text: 'Responsibility, Discipline, Dependability, Commitment, Professionalism.',
            },
            {
              icon: 'bi bi-journal-check',
              title: 'Communication',
              text: 'Verbal communication, Written communication, Presentation, Feedback, Listening.',
            },
            {
              icon: 'bi bi-people',
              title: 'Interpersonal Skills',
              text: 'Empathy, Humor, Networking, Tolerance, Diplomacy.',
            },
            {
              icon: 'bi bi-person-hearts',
              title: 'Team Work',
              text: 'Collaboration, Mediation, Conflict management, Coordination, Idea exchange.',
            },
            {
              icon: 'bi bi-watch',
              title: 'Time Management',
              text: 'Planning, Organization, Prioritizing, Goal setting, Stress management.',
            },
          ].map(({ icon, title, text }, idx) => (
            <div className="icon-box mt-5" data-aos="zoom-in" data-aos-delay="150" key={idx}>
              <i className={icon}></i>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
