import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import loginIllustration from "../assets/my_app.png"; // ✅ Ensure this image exists

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login({ onLogin }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    try {
      await onLogin({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
    } catch (err) {
      console.error("Login error:", err.response?.data);
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        data-aos="fade-up"
      >
        {/* Left Side: Illustration + Info */}
        <div className="bg-yellow-500 text-white p-10 md:p-12 flex flex-col items-center justify-center">
          <img
            src={loginIllustration}
            alt="Login Visual"
            className="w-1/2 max-w-[160px] rounded-xl shadow-lg mb-6"
          />

          <h1 className="text-3xl font-bold mb-2 font-poppins text-center">
            Surveyor on Demand Platform
          </h1>
          <p className="text-sm text-yellow-100 text-center font-manrope mb-4">
           <b>MOTTO:</b> Simplifying surveys. Empowering decisions. We are the best in Kenya.
          </p>
          <ul className="text-sm text-yellow-100 font-manrope list-disc list-inside text-center space-y-1">
            <li>Secure and reliable access</li>
            <li>Manage your projects in real time</li>
            <li>Designed for modern teams</li>
            <li>We come in to help people</li>
          </ul>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-14">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4 font-poppins">
            Login
          </h1>
          <b className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back! Please enter your credentials to access your dashboard.
          </b>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 font-manrope">
            <div>
              <label htmlFor="email" className="text-sm text-gray-700 block mb-1 font-medium">
                <i>Email Address</i>
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
              />
              {errors.email && (
                <p className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-gray-700 block mb-1 font-medium">
                <i>Password</i>
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                autoComplete="current-password"
                placeholder="********"
                className="input"
              />
              {errors.password && (
                <p className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-yellow-600 hover:underline font-medium">
              <strong>Sign up here</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
