import React from "react";

const TermsAndPrivacy = () => {
  return (
    <div className="bg-[#fff6e5] min-h-screen py-10 px-6 md:px-20 text-gray-800 font-manrope">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-xl space-y-6">
        <h1 className="text-3xl font-bold text-yellow-600">LandLink Platform — Legal Documents</h1>
        <p className="text-sm text-gray-500">Effective Date: June 7, 2025</p>
        <p className="text-sm text-gray-500">Owned & Operated by: Kimex Communication</p>
        <p className="text-sm text-gray-500">Domain: <a href="https://www.landlink.co.ke" className="underline">www.landlink.co.ke</a></p>

        {/* PRIVACY POLICY */}
        <h2 className="text-xl font-semibold mt-6">📜 Privacy Policy</h2>
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

        {/* TERMS OF SERVICE */}
        <h2 className="text-xl font-semibold mt-8">⚖️ Terms of Service</h2>

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

        {/* Contact */}
        <h3 className="font-bold mt-6">Contact Us</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Support: <a href="mailto:support@landlink.co.ke" className="underline">support@landlink.co.ke</a></li>
          <li>Legal: <a href="mailto:legal@landlink.co.ke" className="underline">legal@landlink.co.ke</a></li>
          <li>Phone: +254 745745186</li>
        </ul>

        <p className="mt-6">LandLink is committed to safe, transparent, and digital land service delivery across Kenya.</p>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
