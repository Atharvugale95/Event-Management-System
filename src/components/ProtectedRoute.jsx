import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  // not logged in
  if (!token || !user) return <Navigate to="/login" />;

  // wrong role
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} />;

  return children;
}

export default ProtectedRoute;