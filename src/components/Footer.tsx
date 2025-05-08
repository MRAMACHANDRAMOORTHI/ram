const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-white py-10 relative">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">MSR</h3>
            <p className="text-gray-400">Your trusted partner in digital excellence.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {['hero', 'experience', 'contact', 'Education'].map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className="text-gray-300 hover:text-white transition"
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-2">
          <div className="text-center">
            &copy; {new Date().getFullYear()} <span className="font-semibold">MSR</span>.
          </div>
          <div className="text-center">
            Designed by{' '}
            <a
              href="https://www.linkedin.com/in/ramachandramoorthi/"
              className="text-gray-300 hover:text-white"
            >
              Ramachandramoorthi
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition"
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/></svg>
      </button>
    </footer>
  );
};

export default Footer;