import { useState } from "react";
import { Briefcase, ExternalLink, ChevronRight, Calendar } from "lucide-react";
// In your entry file or component that uses the icons
import "bootstrap-icons/font/bootstrap-icons.css";

// Make sure to add the ardhika logo to your assets folder!
import ardhika from "../assets/img/logos/ardhiNew.png";
import cict from "../assets/img/logos/cict.jpg";
import retech from "../assets/img/logos/retech.jpg";

const experiences = [
  {
    logo: ardhika,
    role: "Software Engineer",
    company: "Ardhika Software Technologies",
    duration: "Aug 2025 – Present",
    link: "#", // Add actual company link if available
    description:
      "Leading the development of the Helpdesk module for the Sastra Online Learning Platform (LMS). I architected a full-scale support ticketing system using Elixir and Phoenix Framework to handle high-volume admission and fee queries. My key contributions include engineering an automated SLA tracking engine with background job escalation, implementing 'Round Robin' algorithms for automatic ticket assignment, and building real-time analytics dashboards using Vue.js and PostgreSQL aggregations. This system streamlined the support workflow, significantly reducing response times for thousands of students.",
    skills: [
      "Elixir",
      "Phoenix Framework",
      "Vue.js",
      "PostgreSQL",
      "System Design",
    ],
  },
  {
    logo: cict,
    role: "Full Stack Developer Intern",
    company: "Central Institute of Classical Tamil (CICT)",
    duration: "March 2025 – Aug 2025",
    link: "https://www.cict.in",
    description:
      "Played a pivotal role in building a digital learning platform dedicated to promoting classical Tamil resources. I engineered a seamless front-end experience using React and Tailwind CSS, ensuring responsive design across devices. On the backend, I integrated Firebase Authentication and Realtime Database services. This project boosted accessibility to classical materials with over a 30% increase in engagement. I collaborated closely with researchers to deliver intuitive UX designs, focusing on user flow and readability.",
    skills: ["React", "Tailwind CSS", "Firebase", "Node.js", "UI/UX Design"],
  },
  {
    logo: retech,
    role: "Full Stack Java Developer Intern",
    company: "RETECH Solutions Pvt Ltd",
    duration: "May 2024 – Feb 2025",
    link: "https://www.retechsolutions.com",
    description:
      "Worked on enterprise-level applications, developing and optimizing RESTful APIs using Spring Boot. I focused on database efficiency by tuning MySQL queries and implementing effective indexing strategies, resulting in a 25% reduction in data retrieval time. I actively contributed to Agile sprints, collaborating with cross-functional teams for feature planning and deployment. This experience honed my backend development skills in building robust Java-based solutions.",
    skills: ["Java", "Spring Boot", "MySQL", "REST API", "Agile"],
  },
];

interface Experience {
  logo: string;
  role: string;
  company: string;
  duration: string;
  link: string;
  description: string;
  skills: string[];
}

const ExperienceCard = ({
  experience,
  index,
  isLast,
}: {
  experience: Experience;
  index: number;
  isLast: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Timeline line and dot */}
      {/* Logic added: if isLast is true, the line stops at the dot (h-8), otherwise it goes to bottom */}
      <div
        className={`hidden md:block absolute left-0 top-0 w-0.5 bg-blue-200 ${
          isLast ? "h-8" : "bottom-0"
        }`}
      >
        <div className="absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10"></div>
      </div>

      <div className="w-full pl-0 md:pl-10 mb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            {/* Header with logo and title */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
                <img
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  className="w-16 h-16 md:w-12 md:h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/120x120?text=${experience.company.charAt(
                      0
                    )}`;
                  }}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {experience.role}
                  {index === 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Current
                    </span>
                  )}
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
                  >
                    {experience.company}
                    <ExternalLink size={14} className="ml-1" />
                  </a>

                  <span className="hidden sm:block text-gray-400">•</span>

                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {experience.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <div
                className={`relative overflow-hidden ${
                  !expanded && "max-h-20"
                }`}
              >
                <p className="text-gray-700 leading-relaxed text-justify">
                  {experience.description}
                </p>

                {!expanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center"
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronRight
                  size={16}
                  className={`ml-1 transition-transform duration-300 ${
                    expanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-blue-50 to-gray-50"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-3">
            <Briefcase size={24} className="text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Professional Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            My professional journey delivering scalable software solutions and
            full-stack applications.
          </p>
        </div>

        <div className="relative">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={index}
              experience={experience}
              index={index}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
