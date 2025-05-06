import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';

import a from '../assets/img/screenshots/a.png';
import b from '../assets/img/screenshots/b.png';
import c from '../assets/img/screenshots/c.png';
import d from '../assets/img/screenshots/d.png';
import e from '../assets/img/screenshots/e.png';
import f from '../assets/img/screenshots/f.png';
import g from '../assets/img/screenshots/g.png';
import h from '../assets/img/screenshots/h.png';
import i from '../assets/img/screenshots/i.png';

const projects = [
  {
    name: 'Healthchain',
    tech: ['React', 'Node.js', 'TypeScript', 'Firebase'],
    repo: 'https://github.com/MRAMACHANDRAMOORTHI/Healthchain.git',
    demo: 'https://mramachandramoorthi.github.io/Healthchain/',
    screenshots: [a, b, c],
    description: 'HealthChain is a blockchain-based medical records management system designed to ensure secure, transparent, and tamper-proof storage of patient data...',
    fullDescription: 'HealthChain is a blockchain-based medical records management system designed to ensure secure, transparent, and tamper-proof storage of patient data. The platform leverages blockchain technology to give patients control over their medical information while enabling healthcare providers to access necessary data with appropriate permissions.',
  },
  {
    name: 'Scholorsphere',
    tech: ['React', 'Node.js', 'TypeScript', 'Firebase'],
    repo: 'https://github.com/MRAMACHANDRAMOORTHI/Scholorsphere',
    demo: 'https://mramachandramoorthi.github.io/Scholorsphere/',
    screenshots: [d, e, f],
    description: 'Scholorsphere is a comprehensive academic resource-sharing platform developed to foster collaboration among students, faculty, and researchers...',
    fullDescription: 'Scholorsphere is a comprehensive academic resource-sharing platform developed to foster collaboration among students, faculty, and researchers. The platform facilitates the exchange of research papers, educational materials, and academic insights through a user-friendly interface.',
  },
  {
    name: 'Digital E-Learning Platform',
    tech: ['React', 'Node.js', 'TypeScript', 'Firebase'],
    repo: 'https://github.com/CICT-Chennai/elearningportal.git',
    demo: 'https://elearning-portal-ten.vercel.app/',
    screenshots: [g, h, i],
    description: 'Developed a robust and scalable e-learning platform for the Central Institute of Classical Tamil (CICT)...',
    fullDescription: 'Developed a robust and scalable e-learning platform for the Central Institute of Classical Tamil (CICT). This comprehensive solution offers interactive courses, multimedia learning resources, and personalized learning paths for students of Tamil language and literature.',
  },
];

interface Project {
  name: string;
  tech: string[];
  repo: string;
  demo: string;
  screenshots: string[];
  description: string;
  fullDescription: string;
}

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Swiper */}
      <div className="relative h-52">
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
                alt={`${project.name} screenshot ${i+1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `/api/placeholder/400/300?text=${project.name}`;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Project tech stack overlay on hover */}
        <div 
          className={`absolute inset-0 bg-black/70 flex items-center justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {project.tech.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
          <span className={`inline-block w-3 h-3 rounded-full ${isHovered ? 'bg-green-500' : 'bg-blue-500'} transition-colors duration-300`}></span>
        </div>
        
        {/* Description with transition */}
        <motion.div 
          className="overflow-hidden mb-4"
          animate={{ height: isHovered ? 'auto' : '4.5rem' }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            {isHovered ? project.fullDescription : project.description}
          </p>
        </motion.div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${isHovered ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Live Demo
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium border border-gray-200 transition-all duration-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <div id="projects" className="p-4 projects">

    <section  className="m-5 py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">My Projects</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore my latest work and technical projects. Each card showcases the technologies used 
          and provides links to live demos and code repositories.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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