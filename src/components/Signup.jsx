// src/pages/Signup.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const signupSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["client", "surveyor"]),
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
    defaultValues: { role: "" },
  });

  const role = watch("role");
  const idCard = watch("idCard");
  const certificate = watch("certificate");
  const iskNumber = watch("iskNumber");

  const onSubmit = async (data) => {
    try {
      // Enforce required surveyor fields on the client side
      if (data.role === "surveyor") {
        if (!iskNumber?.trim()) {
          setError("iskNumber", { message: "ISK number is required for surveyors" });
          return;
        }

        if (!idCard?.[0]) {
          setError("idCard", { message: "ID card upload is required for surveyors" });
          return;
        }

        if (!certificate?.[0]) {
          setError("certificate", { message: "Certificate upload is required for surveyors" });
          return;
        }
      }

      if (data.role === "surveyor") {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "idCard" || key === "certificate") return;
          formData.append(key, value);
        });

        if (data.idCard?.[0]) formData.append("idCard", data.idCard[0]);
        if (data.certificate?.[0]) formData.append("certificate", data.certificate[0]);

        await axios.post("http://localhost:5000/api/auth/signup", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/api/auth/signup", {
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
      console.error("❌ Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white p-10 md:p-12 rounded-3xl shadow-xl ring-1 ring-yellow-200"
      >
        <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          Create Account With Us
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
          className="space-y-7"
        >
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              <b>Full Name</b>
            </label>
            <input
              id="name"
              {...register("name")}
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="input"
            />
            {errors.name && <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              <b>Email Address</b>
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              <b>Password</b>
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              className="input"
            />
            {errors.password && (
              <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              <em>
                Use a strong password with at least 6 characters, including a mix of letters,
                numbers, and symbols.
              </em>
            </p>
          </div>

          <div>
            <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
              <b>Select Role</b>
            </label>
            <select
              id="role"
              {...register("role")}
              className="input cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                -- Choose a role --
              </option>
              <option value="client">Client</option>
              <option value="surveyor">Surveyor</option>
            </select>
            {errors.role && <p className="text-red-600 mt-1 text-sm">{errors.role.message}</p>}
          </div>

          {role === "surveyor" && (
            <fieldset className="border border-yellow-300 rounded-lg p-5 space-y-5 mt-4">
              <legend className="font-semibold text-yellow-600">Surveyor Details</legend>

              <div>
                <label htmlFor="iskNumber" className="block mb-2 font-medium text-gray-700">
                  <b>ISK Number</b>
                </label>
                <input
                  id="iskNumber"
                  {...register("iskNumber")}
                  type="text"
                  placeholder="ISK Number"
                  className="input"
                />
                {errors.iskNumber && (
                  <p className="text-red-600 mt-1 text-sm">{errors.iskNumber.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="idCard" className="block mb-2 font-medium text-gray-700">
                  <b>Upload ID Card</b> <span className="text-xs text-gray-500">(jpg, png, pdf)</span>
                </label>
                <input
                  id="idCard"
                  {...register("idCard")}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input file:cursor-pointer"
                />
                {errors.idCard && (
                  <p className="text-red-600 mt-1 text-sm">{errors.idCard.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="certificate" className="block mb-2 font-medium text-gray-700">
                  <b>Upload Certificate</b> <span className="text-xs text-gray-500">(jpg, png, pdf)</span>
                </label>
                <input
                  id="certificate"
                  {...register("certificate")}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input file:cursor-pointer"
                />
                {errors.certificate && (
                  <p className="text-red-600 mt-1 text-sm">{errors.certificate.message}</p>
                )}
              </div>
            </fieldset>
          )}

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
          <Link to="/login" className="text-yellow-600 hover:underline font-semibold">
            <strong>Log in here</strong>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
