// src/Pages/PrivacyPolicy.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-12 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-indigo-100 text-lg md:text-xl">
              Last updated: February 27, 2026
            </p>
          </div>

          <div className="p-8 md:p-12 lg:p-16 prose prose-indigo max-w-none">
            <p className="text-gray-600 mb-8 leading-relaxed">
              At B2B Portal ("we", "us", or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us as a buyer, supplier, or visitor.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li><strong>Personal Information:</strong> Name, email address, phone number, company name, business address, GST/VAT number, bank details (for verified payments), etc.</li>
              <li><strong>Business Information:</strong> Product listings, company registration documents, trade licenses, certifications</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, operating system, pages visited, time spent</li>
              <li><strong>Transaction Information:</strong> Inquiries sent, quotes received, orders placed (we do not store full payment card details)</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>To provide, maintain, and improve our B2B marketplace services</li>
              <li>To verify business identities and prevent fraud</li>
              <li>To facilitate communication between buyers and suppliers</li>
              <li>To send important service updates, inquiries, quotes, and notifications</li>
              <li>To comply with legal obligations and resolve disputes</li>
              <li>To analyze platform usage and improve user experience</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">3. Information Sharing & Disclosure</h2>
            <p className="text-gray-700 mb-4">We may share your information in these limited cases:</p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>With the other party in a transaction (buyer ↔ supplier) — only necessary business contact details</li>
              <li>With service providers (payment gateways, logistics partners, cloud hosting) under strict confidentiality</li>
              <li>When required by law, court order, or government authority</li>
              <li>In case of merger, acquisition, or sale of company assets</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>We never sell your personal data to third parties for marketing purposes.</strong>
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">4. Data Security</h2>
            <p className="text-gray-700">
              We implement industry-standard security measures including SSL encryption, access controls, regular security audits, and data minimization practices. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Access, correct, or delete your personal information</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Request data portability (where technically feasible)</li>
            </ul>
            <p className="text-gray-700 mt-6">
              To exercise these rights, please contact us at <a href="mailto:privacy@b2b.in" className="text-indigo-600 hover:underline">privacy@b2b.in</a>.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">6. International Data Transfers</h2>
            <p className="text-gray-700">
              As a global B2B platform, your data may be transferred to and processed in countries outside your jurisdiction. We ensure appropriate safeguards (such as Standard Contractual Clauses) are in place for such transfers.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">7. Cookies & Tracking</h2>
            <p className="text-gray-700">
              We use cookies and similar technologies to enhance user experience, analyze traffic, and personalize content. You can manage cookie preferences through your browser settings. For more details, see our <a href="/cookies" className="text-indigo-600 hover:underline">Cookie Policy</a>.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">8. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">9. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              If you have any questions about this Privacy Policy, please contact:
            </p>
            <p className="text-gray-900 font-medium">
              Email: <a href="mailto:privacy@b2b.in" className="text-indigo-600 hover:underline">privacy@b2b.in</a><br />
              Phone: +91 75052 66931
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;