import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { X, Download, FileText, Shield, Mail, Phone, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndPrivacyModal = () => {
  const contentRef = useRef();
  const navigate = useNavigate();

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

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200/50 p-8 relative text-slate-700 font-inter">
        {/* Enhanced Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200 hover:scale-105 active:scale-95 z-10"
        >
          <X size={20} />
        </button>

        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                Legal Documents
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Terms of Service & Privacy Policy
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 w-fit"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>

        {/* Enhanced Content */}
        <div ref={contentRef} className="space-y-8 text-sm lg:text-base">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Effective Date</p>
                <p className="font-semibold text-slate-700">June 7, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Owned & Operated by</p>
                <p className="font-semibold text-slate-700">Kimex Communication</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Domain</p>
                <a href="https://www.landlink.co.ke" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                  www.landlink.co.ke
                </a>
              </div>
            </div>
          </div>

          {/* Privacy Policy Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Privacy Policy</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">Your privacy is important to us. This policy outlines how LandLink collects, uses, shares, and protects your personal data.</p>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-blue-500 pl-3">1. Data We Collect</h3>
              <ul className="space-y-2 ml-2">
                {[
                  { icon: "👤", text: "Personal Info: Name, phone number, email, national ID" },
                  { icon: "📍", text: "Location Data: GPS coordinates" },
                  { icon: "💻", text: "Device Data: IP address, browser, OS" },
                  { icon: "📊", text: "Service Data: Booking history, uploaded files" },
                  { icon: "💳", text: "Payment Data: M-Pesa or card transaction details" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <span className="text-slate-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-blue-500 pl-3">2. How We Use Your Data</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "Match clients with licensed surveyors and GIS experts",
                  "Process payments and send notifications",
                  "Verify licensing and identity",
                  "Generate usage analytics",
                  "Protect users from fraud"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-blue-500 pl-3">3. Sharing of Data</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "With verified surveyors/GIS experts during bookings",
                  "With payment providers (M-Pesa, Paystack)",
                  "With government bodies (if legally required)"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-blue-500 pl-3">4. Security Measures</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "HTTPS encrypted access",
                  "JWT authentication",
                  "OTP verification",
                  "Secure file uploads"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-blue-500 pl-3">5. Your Rights</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "Request deletion/correction of personal data",
                  "Access a copy of your data",
                  "Revoke consent for marketing"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 ml-5 mt-3">
                To make a request, email:{" "}
                <a href="mailto:tituswaweru631@gmail.com" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                  tituswaweru631@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Terms of Service Section */}
          <section className="space-y-6 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Terms of Service</h2>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-green-500 pl-3">1. Platform Usage</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "You must be 18+ and legally capable of entering contracts",
                  "You are responsible for your account and security"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-green-500 pl-3">2. Service Rules</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "Clients must only book legal land services",
                  "Surveyors & GIS Experts must maintain licenses and availability",
                  "Fraudulent use is strictly prohibited"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-green-500 pl-3">3. Payment Terms</h3>
              <ul className="space-y-2 ml-2">
                {[
                  "Payments via Paystack or M-Pesa",
                  "Platform may deduct a commission",
                  "Surveyors paid after client confirmation"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-green-500 pl-3">4. Liability Disclaimer</h3>
              <p className="text-slate-600 ml-5">LandLink is a facilitator, not a party to contracts. We are not liable for disputes or service quality.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-green-500 pl-3">5. Intellectual Property</h3>
              <p className="text-slate-600 ml-5">All platform code, branding, and content belong to Kimex Communication.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-l-4 border-green-500 pl-3">6. Termination</h3>
              <p className="text-slate-600 ml-5">We may suspend accounts violating terms. You may also request account deletion.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="pt-8 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: "Support", value: "tituswaweru631@gmail.com" },
                { icon: Mail, label: "Legal", value: "tituswaweru631@gmail.com" },
                { icon: Phone, label: "Phone", value: "+254 745745186" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <item.icon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{item.label}</p>
                    <p className="font-semibold text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <p className="text-amber-700 font-medium">
              LandLink is committed to safe, transparent, and digital land service delivery across Kenya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyModal;