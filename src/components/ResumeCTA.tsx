import React, { useState } from 'react';
import cta from '../assets/img/cta-bg.jpg'; // Adjust the path as necessary
const ResumeCTA = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Direct link to your Google Drive file for download
      // Using the direct download link format
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
    <section id="cta" className="cta"  style={{ backgroundImage: `url(${cta})` }}>
      <div className="container" data-aos="zoom-in">
        <div className="text-center">
          <h3>My Resume</h3>
          <p>Download my latest resume to explore my professional experience, skills, and projects.</p>
          <button 
            onClick={handleDownload} 
            className="cta-btn"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Downloading...
              </>
            ) : (
              <>
                <i className="bx bx-download me-2"></i>
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