import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { X } from "lucide-react";

const TermsAndPrivacyModal = ({ onClose }) => {
  const contentRef = useRef();

  const handleDownload = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: 'LandLink_Legal_Documents.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative text-gray-800 font-manrope">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-yellow-600">
            LandLink Legal Documents
          </h1>
          <button
            onClick={handleDownload}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Download PDF
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-6 text-sm">
          <p className="text-gray-500">Effective Date: June 7, 2025</p>
          <p className="text-gray-500">Owned & Operated by: Kimex Communication</p>
          <p className="text-gray-500">
            Domain: <a href="https://www.landlink.co.ke" className="underline">www.landlink.co.ke</a>
          </p>

          <h2 className="text-lg font-semibold mt-6">📜 Privacy Policy</h2>
          <p>Your privacy is important to us. This policy outlines how LandLink collects, uses, shares, and protects your personal data.</p>

          <h3 className="font-bold">1. Data We Collect</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal Info:</strong> Name, phone number, email, national ID</li>
            <li><strong>Location Data:</strong> GPS coordinates</li>
            <li><strong>Device Data:</strong> IP address, browser, OS</li>
            <li><strong>Service Data:</strong> Booking history, uploaded files</li>
            <li><strong>Payment Data:</strong> M-Pesa or card transaction details</li>
          </ul>

          <h3 className="font-bold mt-4">2. How We Use Your Data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Match clients with licensed surveyors and GIS experts</li>
            <li>Process payments and send notifications</li>
            <li>Verify licensing and identity</li>
            <li>Generate usage analytics</li>
            <li>Protect users from fraud</li>
          </ul>

          <h3 className="font-bold mt-4">3. Sharing of Data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>With verified surveyors/GIS experts during bookings</li>
            <li>With payment providers (M-Pesa, Paystack)</li>
            <li>With government bodies (if legally required)</li>
          </ul>

          <h3 className="font-bold mt-4">4. Security Measures</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>HTTPS encrypted access</li>
            <li>JWT authentication</li>
            <li>OTP verification</li>
            <li>Secure file uploads</li>
          </ul>

          <h3 className="font-bold mt-4">5. Your Rights</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request deletion/correction of personal data</li>
            <li>Access a copy of your data</li>
            <li>Revoke consent for marketing</li>
          </ul>
          <p>To make a request, email: <a href="mailto:privacy@landlink.co.ke" className="underline">privacy@landlink.co.ke</a></p>

          <h2 className="text-lg font-semibold mt-8">⚖️ Terms of Service</h2>

          <h3 className="font-bold mt-4">1. Platform Usage</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be 18+ and legally capable of entering contracts</li>
            <li>You are responsible for your account and security</li>
          </ul>

          <h3 className="font-bold mt-4">2. Service Rules</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Clients must only book legal land services</li>
            <li>Surveyors & GIS Experts must maintain licenses and availability</li>
            <li>Fraudulent use is strictly prohibited</li>
          </ul>

          <h3 className="font-bold mt-4">3. Payment Terms</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Payments via Paystack or M-Pesa</li>
            <li>Platform may deduct a commission</li>
            <li>Surveyors paid after client confirmation</li>
          </ul>

          <h3 className="font-bold mt-4">4. Liability Disclaimer</h3>
          <p>LandLink is a facilitator, not a party to contracts. We are not liable for disputes or service quality.</p>

          <h3 className="font-bold mt-4">5. Intellectual Property</h3>
          <p>All platform code, branding, and content belong to Kimex Communication.</p>

          <h3 className="font-bold mt-4">6. Termination</h3>
          <p>We may suspend accounts violating terms. You may also request account deletion.</p>

          <h3 className="font-bold mt-6">Contact Us</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Support: <a href="mailto:support@landlink.co.ke" className="underline">support@landlink.co.ke</a></li>
            <li>Legal: <a href="mailto:legal@landlink.co.ke" className="underline">legal@landlink.co.ke</a></li>
            <li>Phone: +254 745745186</li>
          </ul>

          <p className="mt-6">LandLink is committed to safe, transparent, and digital land service delivery across Kenya.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyModal;
