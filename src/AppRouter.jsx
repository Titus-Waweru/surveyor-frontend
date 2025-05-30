import React from "react";
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

// LANDING PAGE & BOOK DEMO
import LandingPage from "./pages/LandingPage";
import BookDemo from "./pages/BookDemo";

function getDefaultDashboard(role) {
  switch (role) {
    case "client":
      return "/client/overview";
    case "surveyor":
      return "/surveyor/overview";
    case "admin":
      return "/admin/overview";
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

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();

  // **Removed user rehydration here!** This happens only once in App.jsx

  async function handleLogin(credentials) {
    try {
      const response = await API.post("/auth/login", credentials);
      const loggedInUser = response.data;

      if (!loggedInUser?.email) throw new Error("Login failed");

      // Extract only needed fields
      const userObj = {
        id: loggedInUser.id || null,
        email: loggedInUser.email,
        role: loggedInUser.role,
        token: loggedInUser.token,
      };

      localStorage.setItem("token", userObj.token);
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      navigate(getDefaultDashboard(userObj.role));
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

  async function handleLogout() {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.warn("Server logout failed, continuing with client logout.");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login", { replace: true });
    }
  }

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* ADMIN AUTH */}
      <Route path="/admin/auth" element={<AdminAuth setUser={setUser} />} />
      <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* CLIENT DASHBOARD ROUTES */}
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

      {/* SURVEYOR DASHBOARD ROUTES */}
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

      {/* ADMIN DASHBOARD ROUTES */}
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

      {/* PUBLIC PAGES */}
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
      <Route path="*" element={<Navigate to="/" />} />
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
