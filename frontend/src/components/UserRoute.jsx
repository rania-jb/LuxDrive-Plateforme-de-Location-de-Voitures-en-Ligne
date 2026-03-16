import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  return children;
};

export default UserRoute;
