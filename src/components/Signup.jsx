import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { motion } from "framer-motion";

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
    defaultValues: { role: "client" },  // changed from "" to "client" for select default
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

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-xl ring-1 ring-yellow-200"
      >
        <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          Create Account With Us
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
          className="space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              {...register("name")}
              type="text"
              className="input"
              placeholder="First      Middle      Surname"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              className="input"
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Use at least 6 characters with a mix of letters, numbers, and
              symbols.
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block mb-2 font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              {...register("role")}
              className="input cursor-pointer"
              // Removed defaultValue here to let react-hook-form manage it
            >
              <option value="" disabled>
                -- Choose a role --
              </option>
              <option value="client">Landlink Client</option>
              <option value="surveyor">Landlink Surveyor</option>
              <option value="gis">Landlink GIS Expert</option>
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Surveyor or GIS Expert Fields */}
          {(role === "surveyor" || role === "gis") && (
            <fieldset className="border border-yellow-300 rounded-lg p-5 mt-2 space-y-5">
              <legend className="font-semibold text-yellow-600">
                {role === "gis"
                  ? "GIS Expert Details"
                  : "Surveyor Details"}
              </legend>

              {/* ISK Number */}
              <div>
                <label
                  htmlFor="iskNumber"
                  className="block mb-2 font-medium text-gray-700"
                >
                  ISK Number
                </label>
                <input
                  id="iskNumber"
                  {...register("iskNumber")}
                  type="text"
                  className="input"
                  placeholder="Enter your ISK number(optional)"
                />
                {errors.iskNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.iskNumber.message}
                  </p>
                )}
              </div>

              {/* ID Card */}
              <div>
                <label
                  htmlFor="idCard"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Upload ID Card{" "}
                  <span className="text-xs text-gray-500">(jpg, png, pdf)</span>
                </label>
                <input
                  id="idCard"
                  {...register("idCard")}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="input file:cursor-pointer"
                />
                {errors.idCard && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.idCard.message}
                  </p>
                )}
              </div>

              {/* Certificate */}
              <div>
                <label
                  htmlFor="certificate"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Upload Certificate{" "}
                  <span className="text-xs text-gray-500">(jpg, png, pdf)</span>
                </label>
                <input
                  id="certificate"
                  {...register("certificate")}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="input file:cursor-pointer"
                />
                {errors.certificate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.certificate.message}
                  </p>
                )}
              </div>
            </fieldset>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-600 hover:underline font-semibold"
          >
            <strong>Log in here</strong>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
