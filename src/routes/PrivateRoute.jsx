import { Navigate, useLocation } from "react-router-dom";

// ✅ Role-based default dashboard paths
const getDefaultDashboard = (role) => {
  switch (role) {
    case "client":
      return "/client/overview";
    case "surveyor":
      return "/surveyor/overview";
    case "admin":
      return "/admin/overview";
    case "gis-expert":
      return "/gis/overview"  
    default:
      return "/login";
  }
};

export default function PrivateRoute({ user, role, children }) {
  const location = useLocation();

  // ⛔ Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ⛔ Logged in but wrong role
  if (user.role !== role) {
    return <Navigate to={getDefaultDashboard(user.role)} replace />;
  }

  // ✅ Authorized
  return children;
}
