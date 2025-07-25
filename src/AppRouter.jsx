import React, { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import API from "./utils/axios";

// AUTH PAGES
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// CLIENT PAGES
import ClientDashboard from "./pages/ClientDashboard";
import ClientOverview from "./pages/ClientOverview";
import ClientBookings from "./pages/ClientBookings";
import ClientProfile from "./pages/ClientProfile";
import ClientSettings from "./pages/ClientSettings";
import ClientLayout from "./components/dashboard/ClientLayout";

// SHARED
import Payments from "./pages/Payments";

// SURVEYOR PAGES
import SurveyorDashboard from "./pages/SurveyorDashboard";
import SurveyorProfile from "./pages/SurveyorProfile";
import SurveyorSettings from "./pages/SurveyorSettings";
import SurveyorLayout from "./components/dashboard/SurveyorLayout";

// ADMIN PAGES
import AdminOverview from "./admin/AdminOverview";
import AdminBookings from "./admin/AdminBookings";
import AdminProfile from "./admin/AdminProfile";
import AdminSettings from "./admin/AdminSettings";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminSignup from "./admin/AdminSignup";
import AdminAuth from "./pages/AdminAuth";

// GIS EXPERT PAGES
import GISLayout from "./components/dashboard/GISLayout";
import GISDashboard from "./pages/GISDashboard";
import GISProfile from "./pages/GISProfile";
import GISSettings from "./pages/GISSettings";

// LANDING PAGE & BOOK DEMO
import LandingPage from "./pages/LandingPage";
import BookDemo from "./pages/BookDemo";

// NEW PAGES
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import News from "./pages/News";
import AboutUs from "./pages/AboutUs";

// ✅ NEWS DETAIL PAGES
import MpesaIntegration from "./pages/news/MpesaIntegration";
import LandRegulations from "./pages/news/LandRegulations";
import SurveyorTools from "./pages/news/SurveyorTools";

// LEGAL
import TermsAndPrivacy from "./pages/TermsAndPrivacy";

// REVIEW FORM
import ReviewForm from "./pages/ReviewForm";

// ✅ TEAM MEMBER PAGES
import TitusWaweru from "./pages/TitusWaweru";
import SarahMwangi from "./pages/SarahMwangi";
import MichaelOtieno from "./pages/MichaelOtieno";

function getDefaultDashboard(role) {
  switch (role) {
    case "client":
      return "/client/overview";
    case "surveyor":
      return "/surveyor/overview";
    case "admin":
      return "/admin/overview";
    case "gis":
      return "/gis/overview";
    default:
      return "/login";
  }
}

function PrivateRoute({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return <Navigate to={getDefaultDashboard(user.role)} replace />;
  return children;
}

function AppRoutes({ user, setUser, onLogin, onLogout }) {
  const navigate = useNavigate();
  const initialRedirectDone = useRef(false);

  useEffect(() => {
    if (user && !initialRedirectDone.current) {
      navigate(getDefaultDashboard(user.role));
      initialRedirectDone.current = true;
    }
  }, [user, navigate]);

  async function handleLogin(credentials) {
    try {
      const response = await API.post("/auth/login", credentials);
      const loggedInUser = response.data;

      if (!loggedInUser?.email) throw new Error("Login failed");

      const userObj = {
        id: loggedInUser.id || null,
        email: loggedInUser.email,
        role: loggedInUser.role.toLowerCase(),
      };
      const token = loggedInUser.token;

      onLogin(userObj, token);
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  }

  async function handleSignup(signupData) {
    try {
      const config = {
        headers: {
          "Content-Type":
            signupData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      };
      const response = await API.post("/auth/signup", signupData, config);
      if (!response.data) throw new Error("Signup failed");

      alert("Signup successful! Please check your email and verify your OTP.");
      navigate("/verify-otp");
    } catch (error) {
      console.error("Signup error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again."
      );
    }
  }

  function handleLogout() {
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  }

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={getDefaultDashboard(user.role)} replace />
          ) : (
            <Login onSubmit={handleLogin} />
          )
        }
      />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ADMIN AUTH */}
      <Route path="/admin/auth" element={<AdminAuth setUser={setUser} />} />
      <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* CLIENT DASHBOARD */}
      <Route
        path="/client"
        element={
          <PrivateRoute user={user} role="client">
            <ClientLayout user={user} onLogout={handleLogout} />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<ClientOverview user={user} />} />
        <Route path="dashboard" element={<ClientDashboard user={user} />} />
        <Route path="bookings" element={<ClientBookings user={user} />} />
        <Route path="payments" element={<Payments user={user} />} />
        <Route path="profile" element={<ClientProfile user={user} />} />
        <Route path="settings" element={<ClientSettings user={user} />} />
      </Route>

      {/* SURVEYOR DASHBOARD */}
      <Route
        path="/surveyor"
        element={
          <PrivateRoute user={user} role="surveyor">
            <SurveyorLayout user={user} onLogout={handleLogout} />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<SurveyorDashboard user={user} />} />
        <Route path="payments" element={<Payments user={user} />} />
        <Route path="profile" element={<SurveyorProfile user={user} />} />
        <Route path="settings" element={<SurveyorSettings user={user} />} />
      </Route>

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <PrivateRoute user={user} role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* GIS DASHBOARD */}
      <Route
        path="/gis"
        element={
          <PrivateRoute user={user} role="gis">
            <GISLayout user={user} onLogout={handleLogout} />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<GISDashboard user={user} />} />
        <Route path="profile" element={<GISProfile user={user} />} />
        <Route path="settings" element={<GISSettings user={user} />} />
      </Route>

      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={getDefaultDashboard(user.role)} replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/book-demo" element={<BookDemo />} />
      <Route path="/home" element={<Home />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/mpesa-integration" element={<MpesaIntegration />} />
      <Route path="/news/land-regulations" element={<LandRegulations />} />
      <Route path="/news/surveyor-tools" element={<SurveyorTools />} />
      <Route path="/about" element={<AboutUs />} />

      {/* ✅ TEAM MEMBER PAGES */}
      <Route path="/about/titus-waweru" element={<TitusWaweru />} />
      <Route path="/about/sarah-mwangi" element={<SarahMwangi />} />
      <Route path="/about/michael-otieno" element={<MichaelOtieno />} />

      <Route path="/terms" element={<TermsAndPrivacy />} />
      <Route path="/review" element={<ReviewForm />} />

      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppRouter(props) {
  return (
    <BrowserRouter>
      <AppRoutes {...props} />
    </BrowserRouter>
  );
}
