import React from "react";
import {
  FaFileExcel,
  FaBook,
  FaGraduationCap,
  FaLaptopCode,
} from "react-icons/fa";

const counts = [
  {
    icon: <FaFileExcel className="text-green-600 text-4xl" />,
    count: 441,
    label: "10th Grade",
    note: "Out of 500",
    link: "https://schools.org.in/dindigul/33300800505/govt-hr-sec-school-thirumalairayapuram.html",
    institution: "Govt Higher Secondary School, Thirumalairayapuram",
    year: "2016",
  },
  {
    icon: <FaBook className="text-indigo-600 text-4xl" />,
    count: 832,
    label: "12th Grade",
    note: "Out of 1200 (Maths - Computer Science)",
    link: "https://schools.org.in/dindigul/33300800505/govt-hr-sec-school-thirumalairayapuram.html",
    institution: "Govt Higher Secondary School, Thirumalairayapuram",
    year: "2018",
  },
  {
    icon: <FaGraduationCap className="text-yellow-600 text-4xl" />,
    count: 8.5,
    label: "B.Sc. Computer Science",
    note: "CGPA - GTN Arts & Science College (2020–2023)",
    link: "https://gtnarts.org/",
    institution: "GTN Arts and Science College, Dindigul",
    year: "2023",
  },
  {
    icon: <FaLaptopCode className="text-purple-600 text-4xl" />,
    count: 9.40,
    label: "MCA",
    note: "CGPA - SRM Institute of Science & Tech (2023–2025)",
    link: "https://www.srmist.edu.in/",
    institution: "SRM Institute of Science and Technology",
    year: "2025",
  },
];

const Counts: React.FC = () => (
  <div id="Education" className="p-12">
    <section id="counts" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800">
            🎓 Educational Achievements
          </h2>
          <p className="text-gray-600 mt-2">
            Marks don’t define you, but they reflect your hard work and journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {counts.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 transition-transform hover:scale-105"
              data-aos="zoom-in"
              data-aos-delay={100 * (index + 1)}
            >
              <div className="flex items-center space-x-4 mb-4">
                {item.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500">{item.note}</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-gray-600 mb-2">
                {item.count}
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {item.institution} ({item.year})
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Counts;
