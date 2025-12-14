import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

// Import your existing images
import h1 from "../assets/img/screenshots/HD1.png";
import hd2 from "../assets/img/screenshots/HD2.png";
import hd3 from "../assets/img/screenshots/HD3.png";
import a from "../assets/img/screenshots/a.png";
import b from "../assets/img/screenshots/b.png";
import c from "../assets/img/screenshots/c.png";
import d from "../assets/img/screenshots/d.png";
import e from "../assets/img/screenshots/e.png";
import f from "../assets/img/screenshots/f.png";
import g from "../assets/img/screenshots/g.png";
import h from "../assets/img/screenshots/h.png";
import i from "../assets/img/screenshots/i.png";

// 1. REARRANGED ORDER: Helpdesk -> E-Learn -> ScholarSphere -> HealthChain
const projects = [
  {
    name: "Helpdesk System (Sastra LMS)",
    tech: ["Elixir", "Phoenix", "Vue.js", "PostgreSQL"],
    repo: "https://github.com/MRAMACHANDRAMOORTHI/Helpdesk.git",
    demo: "#",
    comingSoon: true, // Flag for "Launching Soon"
    screenshots: [h1, hd2, hd3],
    description:
      "A high-performance ticketing system architected for the Sastra Online Learning Platform to streamline admission and fee queries.",
    fullDescription:
      'Solely architected the Helpdesk module using Phoenix (Elixir) and Vue3. Features include an automated SLA tracking engine, "Round Robin" ticket assignment algorithms, and real-time analytics dashboards. The system handles thousands of student queries with a robust state-machine workflow.',
  },
  {
    name: "Digital E-Learning Platform",
    tech: ["React", "Node.js", "TypeScript", "Firebase"],
    repo: "https://github.com/CICT-Chennai/elearningportal.git",
    demo: "https://elearning-portal-ten.vercel.app/",
    comingSoon: false,
    screenshots: [g, h, i],
    description:
      "Developed a robust and scalable e-learning platform for the Central Institute of Classical Tamil (CICT) with interactive courses.",
    fullDescription:
      "Developed a robust and scalable e-learning platform for the Central Institute of Classical Tamil (CICT). This comprehensive solution offers interactive courses, multimedia learning resources, and personalized learning paths for students of Tamil language and literature.",
  },
  {
    name: "Scholorsphere",
    tech: ["React", "Node.js", "TypeScript", "Firebase"],
    repo: "https://github.com/MRAMACHANDRAMOORTHI/Scholorsphere",
    demo: "https://mramachandramoorthi.github.io/Scholorsphere/",
    comingSoon: false,
    screenshots: [d, e, f],
    description:
      "Scholorsphere is a comprehensive academic resource-sharing platform developed to foster collaboration among students and faculty.",
    fullDescription:
      "Scholorsphere is a comprehensive academic resource-sharing platform developed to foster collaboration among students, faculty, and researchers. The platform facilitates the exchange of research papers, educational materials, and academic insights through a user-friendly interface.",
  },
  {
    name: "Healthchain",
    tech: ["React", "Node.js", "TypeScript", "Firebase"],
    repo: "https://github.com/MRAMACHANDRAMOORTHI/Healthchain.git",
    demo: "https://mramachandramoorthi.github.io/Healthchain/",
    comingSoon: false,
    screenshots: [a, b, c],
    description:
      "HealthChain is a blockchain-based medical records management system designed to ensure secure, transparent, and tamper-proof storage.",
    fullDescription:
      "HealthChain is a blockchain-based medical records management system designed to ensure secure, transparent, and tamper-proof storage of patient data. The platform leverages blockchain technology to give patients control over their medical information while enabling healthcare providers to access necessary data with appropriate permissions.",
  },
  // Add other projects here if needed
];

interface Project {
  name: string;
  tech: string[];
  repo: string;
  demo: string;
  comingSoon?: boolean;
  screenshots: string[];
  description: string;
  fullDescription: string;
}

const ProjectCard: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Swiper */}
      <div className="relative h-52 shrink-0">
        <Swiper
          effect="cards"
          grabCursor={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[EffectCards, Pagination, Autoplay]}
          className="h-full w-full"
        >
          {project.screenshots.map((src, i) => (
            <SwiperSlide key={i} className="bg-gray-100">
              <img
                src={src}
                alt={`${project.name} screenshot ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/600x400?text=${project.name}`;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Project tech stack overlay on hover */}
        <div
          className={`absolute inset-0 bg-black/70 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          } z-10`}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {project.tech.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
            {project.name}
          </h2>
          <span
            className={`inline-block w-3 h-3 shrink-0 rounded-full ${
              isHovered ? "bg-green-500" : "bg-blue-500"
            } transition-colors duration-300`}
          ></span>
        </div>

        {/* Description Container - Fixed Height to prevent layout shift */}
        <div className="relative h-24 mb-4 group/desc">
          <div
            className={`h-full text-gray-600 text-sm leading-relaxed ${
              isHovered ? "overflow-y-auto pr-1" : "overflow-hidden"
            }`}
          >
            {isHovered ? project.fullDescription : project.description}
          </div>
          {/* Subtle fade effect at bottom if not hovered to indicate more text */}
          {!isHovered && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          )}
        </div>

        {/* Action Buttons - Pushed to bottom */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          {project.comingSoon ? (
            <div className="relative group w-full">
              <button
                disabled
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-gray-300 text-gray-500 text-sm font-medium cursor-not-allowed border border-gray-300"
              >
                Live Demo
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
                Launching Soon 🚀
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          ) : (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
                isHovered
                  ? "bg-purple-600 hover:bg-purple-700 shadow-md"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Live Demo
            </a>
          )}

          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium border border-gray-200 transition-all duration-300 hover:shadow-sm"
          >
            <i className="bi bi-github mr-2"></i> GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <div id="projects" className="projects-section">
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              My Projects
            </h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore my technical portfolio featuring enterprise-grade
              applications, blockchain solutions, and educational platforms.
            </p>
          </div>

          {/* 2. LAYOUT: Forced 2 columns on medium screens and up (md:grid-cols-2 lg:grid-cols-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsSection;
