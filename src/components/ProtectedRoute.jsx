import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Tampilkan loading spinner jika data user belum siap
  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan komponen loading
  }

  // Jika user tidak ada, redirect ke halaman login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika user ada, tetapi role tidak sesuai, redirect ke halaman unauthorized
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika user valid dan role sesuai, tampilkan children
  return children;
};

export default ProtectedRoute;
