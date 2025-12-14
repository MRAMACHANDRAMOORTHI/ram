import React from "react";
import {
  FaFileExcel,
  FaBook,
  FaGraduationCap,
  FaLaptopCode,
} from "react-icons/fa";

const educationData = [
  {
    icon: <FaLaptopCode className="text-white text-xl" />,
    iconBg: "bg-purple-600",
    score: "9.40",
    label: "Master of Computer Applications (MCA)",
    note: "SRM Institute of Science & Technology",
    link: "https://www.srmist.edu.in/",
    location: "Chennai",
    year: "2023 - 2025",
    color: "border-purple-500",
  },
  {
    icon: <FaGraduationCap className="text-white text-xl" />,
    iconBg: "bg-yellow-500",
    score: "8.50",
    label: "B.Sc. Computer Science",
    note: "GTN Arts and Science College",
    link: "https://gtnarts.org/",
    location: "Dindigul",
    year: "2020 - 2023",
    color: "border-yellow-500",
  },
  {
    icon: <FaBook className="text-white text-xl" />,
    iconBg: "bg-indigo-600",
    score: "832",
    label: "Higher Secondary (12th Grade)",
    note: "Govt Higher Secondary School",
    subNote: "Maths - Computer Science",
    link: "https://schools.org.in/dindigul/33131001008/ghss-thirumalairayapuram.html",
    location: "Thirumalairayapuram",
    year: "2018",
    color: "border-indigo-500",
  },
  {
    icon: <FaFileExcel className="text-white text-xl" />,
    iconBg: "bg-green-600",
    score: "441",
    label: "Secondary School (10th Grade)",
    note: "Govt Higher Secondary School",
    subNote: "Out of 500",
    link: "https://schools.org.in/dindigul/33131001008/ghss-thirumalairayapuram.html",
    location: "Thirumalairayapuram",
    year: "2016",
    color: "border-green-500",
  },
];

const Education: React.FC = () => (
  <div id="Education" className="w-full overflow-hidden">
    <section
      id="counts"
      className="py-16 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="inline-block p-2 px-4 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs mb-3">
            Academic Journey
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Educational Achievements
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Grid Layout - Cards made smaller/compact */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {educationData.map((item, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${item.color}`}
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              <div className="flex justify-between items-start mb-4">
                {/* Icon Box */}
                <div
                  className={`p-3 rounded-lg shadow-md ${item.iconBg} transform rotate-3`}
                >
                  {item.icon}
                </div>

                {/* Year Badge */}
                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200 uppercase tracking-wide">
                  {item.year}
                </span>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold text-gray-800">
                    {item.score}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {item.label.includes("Grade") ? "/ Marks" : "/ CGPA"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                  {item.label}
                </h3>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <p className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">
                    {item.note}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <i className="bi bi-geo-alt-fill"></i> {item.location}
                    {item.subNote && (
                      <span className="mx-1">• {item.subNote}</span>
                    )}
                  </p>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Education;
