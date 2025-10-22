import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const signupSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["client", "surveyor", "gis"]),
  iskNumber: z.string().optional(),
  idCard: z.any().optional(),
  certificate: z.any().optional(),
});

export default function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "client" },
  });

  const role = watch("role");
  const idCard = watch("idCard");
  const certificate = watch("certificate");
  const iskNumber = watch("iskNumber");

  const onSubmit = async (data) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/signup`;

      if (["surveyor", "gis"].includes(data.role)) {
        if (!iskNumber?.trim()) {
          setError("iskNumber", { message: "ISK number is required" });
          return;
        }
        if (!idCard?.[0]) {
          setError("idCard", { message: "ID card is required" });
          return;
        }
        if (!certificate?.[0]) {
          setError("certificate", { message: "Certificate is required" });
          return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", data.role);
        formData.append("iskNumber", data.iskNumber);
        formData.append("idCard", data.idCard[0]);
        formData.append("certificate", data.certificate[0]);

        await axios.post(apiUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(apiUrl, {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });
      }

      localStorage.setItem("pendingEmail", data.email);
      localStorage.setItem("pendingRole", data.role);
      navigate("/verify-otp");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-slate-200 rounded-xl shadow-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 bg-white/50 backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50 flex items-center justify-center px-4 py-8 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/20"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent font-poppins mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join LandLink Today
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Create your account and start connecting with surveying professionals
          </motion.p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
          className="space-y-6"
        >
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              {...register("name")}
              type="text"
              className={inputClass}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  className="text-red-600 mt-2 text-sm font-medium flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  className="text-red-600 mt-2 text-sm font-medium flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              className={inputClass}
              placeholder="Create a secure password"
              autoComplete="new-password"
            />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  className="text-red-600 mt-2 text-sm font-medium flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Use at least 6 characters with a mix of letters, numbers, and symbols
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
              Select Your Role
            </label>
            <select 
              id="role" 
              {...register("role")} 
              className={`${inputClass} cursor-pointer`}
            >
              <option value="client">Landlink Client</option>
              <option value="surveyor">Landlink Surveyor</option>
              <option value="gis">Landlink GIS Expert</option>
            </select>
            <AnimatePresence>
              {errors.role && (
                <motion.p
                  className="text-red-600 mt-2 text-sm font-medium flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.role.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Professional Fields */}
          <AnimatePresence>
            {(role === "surveyor" || role === "gis") && (
              <motion.fieldset 
                className="border border-amber-200 rounded-2xl p-6 mt-2 space-y-6 bg-amber-50/50 backdrop-blur-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <legend className="font-semibold text-amber-700 px-3 text-sm">
                  {role === "gis" ? "GIS Expert Verification" : "Surveyor Verification"}
                </legend>

                {/* ISK Number */}
                <div>
                  <label htmlFor="iskNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                    ISK Number <span className="text-amber-600">*</span>
                  </label>
                  <input
                    id="iskNumber"
                    {...register("iskNumber")}
                    type="text"
                    className={inputClass}
                    placeholder="Enter your ISK registration number"
                  />
                  <AnimatePresence>
                    {errors.iskNumber && (
                      <motion.p
                        className="text-red-600 mt-2 text-sm font-medium flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.iskNumber.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* ID Card Upload */}
                <div>
                  <label htmlFor="idCard" className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload ID Card <span className="text-amber-600">*</span>
                    <span className="text-xs text-slate-500 font-normal ml-2">(JPG, PNG, PDF - max 5MB)</span>
                  </label>
                  <input
                    id="idCard"
                    {...register("idCard")}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer`}
                  />
                  <AnimatePresence>
                    {errors.idCard && (
                      <motion.p
                        className="text-red-600 mt-2 text-sm font-medium flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.idCard.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Certificate Upload */}
                <div>
                  <label htmlFor="certificate" className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Professional Certificate <span className="text-amber-600">*</span>
                    <span className="text-xs text-slate-500 font-normal ml-2">(JPG, PNG, PDF - max 5MB)</span>
                  </label>
                  <input
                    id="certificate"
                    {...register("certificate")}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer`}
                  />
                  <AnimatePresence>
                    {errors.certificate && (
                      <motion.p
                        className="text-red-600 mt-2 text-sm font-medium flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.certificate.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Login Prompt */}
        <motion.div 
          className="text-center mt-8 pt-6 border-t border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-slate-600 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}