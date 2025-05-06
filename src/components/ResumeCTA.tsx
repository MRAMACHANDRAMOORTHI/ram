import React, { useState } from 'react';
import cta from '../assets/img/cta-bg.jpg';

const ResumeCTA: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Direct link to your Google Drive file for download
      const resumeUrl = "https://drive.google.com/uc?export=download&id=1yeeM2nsSUSFQ9nqnz2ljbPshEIaRDWFJ";
      
      // Create an anchor element
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.setAttribute('download', 'Ramachandramoorthi_Resume.pdf');
      link.setAttribute('target', '_blank');
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show downloading state briefly for better UX
      setTimeout(() => {
        setIsDownloading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  return (
    <section 
      id="cta" 
      className="py-16 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${cta})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="container mx-auto px-4 relative z-10" data-aos="zoom-in">
        <div className="text-center text-white">
          <h3 className="text-3xl font-bold mb-4">My Resume</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Download my latest resume to explore my professional experience, skills, and projects.
          </p>
          <button 
            onClick={handleDownload} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></span>
                Downloading...
              </>
            ) : (
              <>
                <i className="bi bi-download mr-2"></i>
                Download Resume
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResumeCTA;