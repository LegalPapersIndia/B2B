import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, 
  FaWhatsapp, FaPaperPlane, FaCheckCircle 
} from 'react-icons/fa';

// Custom Spinner Component for the loading state
const Loader = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
  />
);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
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
      }, 6000);
    }, 1500);
  };

  const whatsappLink = `https://wa.me/+917505266931?text=${encodeURIComponent("Hello! I'd like to inquire about B2B Portal services.")}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 lg:py-24 selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-indigo-600 font-bold tracking-widest uppercase text-sm"
          >
            Contact Our Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-3 mb-6 tracking-tight"
          >
            Let’s Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Conversation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you are a global supplier or a local startup, our experts are ready to help you scale your trade operations.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <ContactInfoCard 
              icon={<FaPhoneAlt />} 
              title="Call Us" 
              detail="+91 75052 66931" 
              link="tel:+917505266931"
              color="bg-emerald-50 text-emerald-600"
            />
            <ContactInfoCard 
              icon={<FaEnvelope />} 
              title="Email Us" 
              detail="support@b2bportal.in" 
              link="mailto:support@b2bportal.in"
              color="bg-indigo-50 text-indigo-600"
            />
            <ContactInfoCard 
              icon={<FaMapMarkerAlt />} 
              title="Visit Us" 
              detail="Sector 8, Noida, UP, India" 
              color="bg-amber-50 text-amber-600"
            />

            {/* WhatsApp Premium CTA */}
            <motion.a
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              href={whatsappLink}
              target="_blank"
              className="flex items-center justify-center gap-4 bg-[#25D366] text-white p-6 rounded-3xl font-bold text-xl shadow-lg shadow-green-200 transition-all"
            >
              <FaWhatsapp className="text-3xl" />
              <span>Priority WhatsApp</span>
            </motion.a>
          </motion.div>

          {/* Right Side: Form Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <FaCheckCircle className="text-5xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Message Received!</h3>
                    <p className="text-slate-600 text-lg max-w-sm">
                      Our trade experts will review your inquiry and reach out via email within 24 business hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-7"
                  >
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                    <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" required />
                    <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" required />
                    <InputField label="Inquiry Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Bulk Sourcing" required />
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Your Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none bg-slate-50/50"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full group flex items-center justify-center gap-3 py-5 px-10 rounded-2xl font-bold text-lg text-white transition-all shadow-lg
                          ${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-indigo-600 active:scale-[0.99] hover:shadow-indigo-200'}`}
                      >
                        {loading ? <Loader /> : (
                          <>
                            Submit Inquiry
                            <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-sm" />
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

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-[450px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562064610141!2d77.3621455!3d28.612912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56193796f61%3A0x6b97e972f3d6118d!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
            allowFullScreen=""
            loading="lazy"
            title="Office Location"
          />
        </motion.div>
      </div>
    </div>
  );
};

// Helper Component for Info Cards
const ContactInfoCard = ({ icon, title, detail, link, color }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className="bg-white p-6 rounded-3xl flex items-center gap-5 shadow-sm border border-slate-100"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h4>
      {link ? (
        <a href={link} className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
          {detail}
        </a>
      ) : (
        <p className="text-lg font-bold text-slate-900 leading-tight">{detail}</p>
      )}
    </div>
  </motion.div>
);

// Helper Component for Input Fields
const InputField = ({ label, type = "text", ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-slate-700 mb-2 ml-1">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-slate-50/50 placeholder:text-slate-400"
    />
  </div>
);

export default ContactUs;