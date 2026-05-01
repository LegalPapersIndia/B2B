// src/Pages/ContactUs.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaPaperPlane, 
  FaCheckCircle 
} from 'react-icons/fa';

const Loader = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
  />
);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    phone: '', 
    subject: '', 
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 5000);
    }, 1500);
  };

  const whatsappLink = `https://wa.me/+919211037448?text=${encodeURIComponent("Hello! I'd like to inquire about B2B Portal services.")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-5 py-2 bg-orange-100 text-orange-700 font-semibold tracking-widest text-sm rounded-full mb-4"
          >
            GET IN TOUCH
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mt-3 mb-6 tracking-tight"
          >
            Let’s Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">Conversation</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're a supplier, buyer, or partner — our team is ready to help you grow your business globally.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <ContactInfoCard 
              icon={<FaPhoneAlt />} 
              title="Call Us" 
              detail="+91 92110 37448" 
              link="tel:+919211037448"
              color="bg-orange-100 text-orange-600"
            />
            
            <ContactInfoCard 
              icon={<FaEnvelope />} 
              title="Email Us" 
              detail="support@b2bportal.in" 
              link="mailto:support@b2bportal.in"
              color="bg-blue-100 text-blue-600"
            />
            
            <ContactInfoCard 
              icon={<FaMapMarkerAlt />} 
              title="Visit Us" 
              detail="Sector 8, Noida, Uttar Pradesh, India" 
              color="bg-amber-100 text-amber-600"
            />

            {/* WhatsApp Button */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={whatsappLink}
              target="_blank"
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#20ba5a] text-white p-6 rounded-3xl font-bold text-xl shadow-lg transition-all"
            >
              <FaWhatsapp className="text-4xl" />
              <span>Chat on WhatsApp</span>
            </motion.a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-16"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <FaCheckCircle className="text-6xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h3>
                    <p className="text-gray-600 text-lg max-w-md">
                      Your message has been received. Our team will get back to you within 24 business hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <InputField 
                      label="Full Name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      required 
                    />
                    
                    <InputField 
                      label="Email Address" 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@company.com" 
                      required 
                    />
                    
                    <InputField 
                      label="Phone Number" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+91 98765 43210" 
                      required 
                    />
                    
                    <InputField 
                      label="Subject" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      placeholder="Bulk Enquiry / Partnership" 
                      required 
                    />
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none resize-y bg-gray-50"
                        placeholder="Please tell us about your requirements or inquiry..."
                      />
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg text-white transition-all shadow-lg
                          ${loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-orange-600 hover:bg-orange-700 active:scale-[0.98]'}`}
                      >
                        {loading ? (
                          <Loader />
                        ) : (
                          <>
                            Send Message
                            <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Google Map */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white h-[460px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562064610141!2d77.3621455!3d28.612912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56193796f61%3A0x6b97e972f3d6118d!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="B2B Portal Office Location"
          />
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Contact Info Card
const ContactInfoCard = ({ icon, title, detail, link, color }) => (
  <motion.div 
    whileHover={{ x: 8 }}
    className="bg-white p-7 rounded-3xl flex items-center gap-5 shadow-sm border border-gray-100 hover:border-orange-200 transition-all"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${color}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h4>
      {link ? (
        <a href={link} className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors">
          {detail}
        </a>
      ) : (
        <p className="text-lg font-semibold text-gray-900">{detail}</p>
      )}
    </div>
  </motion.div>
);

// Reusable Input Field
const InputField = ({ label, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none transition-all bg-gray-50 placeholder:text-gray-400"
    />
  </div>
);

export default ContactUs;