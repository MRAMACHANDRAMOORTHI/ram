import { Send, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import "bootstrap-icons/font/bootstrap-icons.css";

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.title ||
      !formData.message
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // --- CREDENTIALS ---
    const SERVICE_ID = "service_4j965nq";
    const TEMPLATE_ID = "template_8f3h7ch";
    // Using .trim() to ensure no accidental spaces are included
    const PUBLIC_KEY = "Fp7LtB83Dsq81zYnB".trim();

    if (form.current) {
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          setIsSubmitting(false);
          setShowAlert(true);
          setFormData({
            name: "",
            email: "",
            title: "",
            message: "",
          });
        },
        (error) => {
          console.error("Failed to send email:", error.text);
          setIsSubmitting(false);
          // Show the actual error message from EmailJS for better debugging
          setErrorMessage("Failed: " + (error.text || "Invalid Keys"));
        }
      );
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div id="contact" className="w-full overflow-hidden">
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          data-aos="fade-up"
        >
          <div className="text-center mb-16">
            <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wider mb-2">
              Contact
            </h2>
            <p className="text-4xl font-bold text-gray-900 mb-6">
              Get In Touch
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Whether you have a project in mind or just want to say hi, I'm
              always open to discussing new opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
            {/* 1. Email */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <i className="bi bi-envelope-fill text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Email</h3>
                  <a
                    href="mailto:mrcmoorthi@gmail.com"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    mrcmoorthi@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Phone */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-full text-green-600">
                  <i className="bi bi-telephone-fill text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Phone</h3>
                  <a
                    href="tel:+918072365616"
                    className="text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    +91 80723 65616
                  </a>
                </div>
              </div>
            </div>

            {/* 3. WhatsApp */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-full text-green-500">
                  <i className="bi bi-whatsapp text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">WhatsApp</h3>
                  <a
                    href="https://wa.me/918072365616"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 font-medium transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 4. LinkedIn */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-700">
                  <i className="bi bi-linkedin text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">LinkedIn</h3>
                  <a
                    href="https://linkedin.com/in/ramachandramoorthi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* 5. GitHub */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-800">
                  <i className="bi bi-github text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">GitHub</h3>
                  <a
                    href="https://github.com/MRAMACHANDRAMOORTHI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
            </div>

            {/* 6. Instagram */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-pink-50 p-3 rounded-full text-pink-600">
                  <i className="bi bi-instagram text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Instagram</h3>
                  <a
                    href="https://www.instagram.com/ramachandramoorthi_m?igsh=YzljYTk1ODg3Zg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 font-medium transition-colors"
                  >
                    Follow Me
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="font-sans relative">
            {showAlert && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
                  <button
                    onClick={closeAlert}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Thank you! I will reply to {formData.email || "you"}{" "}
                      shortly.
                    </p>
                    <button
                      onClick={closeAlert}
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg text-center font-medium">
                {errorMessage}
              </div>
            )}

            <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">
                  Send Me a Message
                </h3>
                <p className="text-gray-500 mt-2">
                  I typically respond within 24 hours.
                </p>
              </div>

              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="John Doe"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="john@example.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-700 ml-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Project Inquiry"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-gray-700 ml-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Write your message here..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-200 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
