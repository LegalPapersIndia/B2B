// src/Component/Footer.jsx
import React from 'react';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt 
} from 'react-icons/fa';

const Footer = () => {
  const categories = [
    { name: 'Medicine', href: '/category/medicine' },
    { name: 'Food & Beverages', href: '/category/food-beverages' },
    { name: 'Cosmetics', href: '/category/cosmetics' },
    { name: 'Confectionery', href: '/category/confectionery' },
    { name: 'Daily Use Items', href: '/category/daily-use' },
    { name: 'Electronics', href: '/category/electronics' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Become a Seller', href: '/' },
    { name: 'Help Center', href: '/help' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund Policy', href: '/refund' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Logo & Description */}
          <div>
            <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight mb-5">
              B2B
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Connecting global buyers and suppliers with trusted B2B marketplace solutions. Quality products, verified businesses, seamless trade.
            </p>
            
            <div className="flex items-center gap-5 mt-6">
              <a href="tel:+917505266931" className="hover:text-white transition-colors text-xl">
                <FaPhoneAlt />
              </a>
              <a href="mailto:support@b2b.in" className="hover:text-white transition-colors text-xl">
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Categories</h3>
            <ul className="space-y-3 text-sm">
              {categories.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-400 hover:text-indigo-300 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-400 hover:text-indigo-300 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3 text-sm mb-8">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-400 hover:text-indigo-300 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-6">
              <a 
                href="https://facebook.com/b2bportal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://twitter.com/b2bportal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://instagram.com/b2bportal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://linkedin.com/company/b2bportal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} B2B Platform. All rights reserved.</p>
          <p className="mt-2">
            Made with ♥ for global trade • Noida, Uttar Pradesh • support@b2b.in
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;