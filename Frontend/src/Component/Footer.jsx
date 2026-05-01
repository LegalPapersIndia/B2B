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
    { name: 'Medicine & Pharma', href: '/category/medicine' },
    { name: 'Food & Beverages', href: '/category/food' },
    { name: 'Cosmetics & Beauty', href: '/category/cosmetics' },
    { name: 'Confectionery & Snacks', href: '/category/confectionery' },
    { name: 'Daily Use & FMCG', href: '/category/daily-use' },
    { name: 'Electronics & Electrical', href: '/category/electronics' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Become a Seller', href: '/become-seller' },
    { name: 'Help Center', href: '/help' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund & Return Policy', href: '/refund' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-3xl">B</span>
              </div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent tracking-tighter">
                B2B
              </div>
            </div>

            <p className="text-gray-400 mb-8 text-[15px] leading-relaxed">
              Connecting global buyers and verified suppliers through a trusted B2B marketplace. 
              Quality products, transparent trade, and seamless sourcing experience.
            </p>
            
            <div className="flex items-center gap-6">
              <a 
                href="tel:+917505266931" 
                className="text-gray-400 hover:text-orange-400 transition-colors text-2xl"
              >
                <FaPhoneAlt />
              </a>
              <a 
                href="mailto:support@yourb2b.com" 
                className="text-gray-400 hover:text-orange-400 transition-colors text-2xl"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Popular Categories</h3>
            <ul className="space-y-3 text-sm">
              {categories.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-400 hover:text-orange-400 hover:translate-x-1 transition-all duration-300 inline-block"
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
                    className="text-gray-400 hover:text-orange-400 hover:translate-x-1 transition-all duration-300 inline-block"
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
            <ul className="space-y-3 text-sm mb-10">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-400 hover:text-orange-400 hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-all hover:scale-110 text-2xl"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-all hover:scale-110 text-2xl"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-400 transition-all hover:scale-110 text-2xl"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-all hover:scale-110 text-2xl"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} B2B Marketplace. All rights reserved.</p>
          <p className="mt-2">
            Designed & Developed by{' '}
            <a 
              href="https://www.legalpapersindia.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Legal Papers India
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;