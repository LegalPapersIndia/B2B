// src/Pages/RefundPolicy.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-indigo-100 text-lg md:text-xl">
              Last updated: February 27, 2026
            </p>
          </div>

          <div className="p-8 md:p-12 lg:p-16 prose prose-indigo max-w-none">
            <p className="text-gray-600 mb-8 leading-relaxed">
              B2B Portal operates as a marketplace connecting buyers and suppliers. We do not directly sell products or hold inventory. All transactions occur directly between buyers and suppliers. Therefore, our refund policy is limited and applies only to specific fees we charge.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">1. Scope of This Policy</h2>
            <p className="text-gray-700 mb-4">
              This Refund Policy applies only to fees paid directly to B2B Portal, such as:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Premium membership / subscription fees</li>
              <li>Featured listing / promotion fees</li>
              <li>Verification / certification fees</li>
              <li>Any other service fees charged by the platform</li>
            </ul>
            <p className="text-gray-700 mt-6 font-medium">
              <strong>Product purchase refunds are governed solely by the individual supplier's refund policy.</strong>
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">2. Refund Eligibility</h2>
            <p className="text-gray-700 mb-4">You may be eligible for a refund if:</p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>You cancel your premium subscription within 7 days of payment (cooling-off period)</li>
              <li>The service you paid for was not delivered at all (e.g., featured listing not activated)</li>
              <li>There is a clear technical error on our platform causing duplicate or incorrect charges</li>
            </ul>
            <p className="text-gray-700 mt-6">
              <strong>No refunds will be issued for:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Change of mind after the 7-day cooling-off period</li>
              <li>Partial use of subscription / service</li>
              <li>Product-related disputes (quality, delivery, quantity, etc.)</li>
              <li>Non-usage or dissatisfaction with supplier interactions</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">3. Refund Process</h2>
            <ol className="list-decimal pl-6 space-y-4 text-gray-700">
              <li>Submit a refund request within 15 days of payment via email to <strong>support@b2b.in</strong> or through your account dashboard.</li>
              <li>Provide order/transaction ID, payment proof, and reason for refund.</li>
              <li>Our team will review the request within 5–7 business days.</li>
              <li>If approved, refund will be processed to the original payment method within 10–15 business days (depending on your bank/payment gateway).</li>
            </ol>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">4. Product / Transaction Disputes</h2>
            <p className="text-gray-700">
              For disputes related to product quality, quantity, delivery, pricing, or any transaction between buyer and supplier, you must contact the other party directly. B2B Portal acts only as a facilitator and is not a party to the sale contract. We may assist in communication but are not responsible for resolving product-related disputes or issuing product refunds.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">5. Contact for Refund Requests</h2>
            <p className="text-gray-700 mb-2">
              Email: <a href="mailto:support@b2b.in" className="text-indigo-600 hover:underline">support@b2b.in</a><br />
              Subject line: Refund Request – [Transaction ID / Order ID]
            </p>

            <div className="mt-16 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-indigo-800 font-medium text-center">
                We strive to maintain complete transparency and fairness in all our policies. Thank you for choosing B2B Portal.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;