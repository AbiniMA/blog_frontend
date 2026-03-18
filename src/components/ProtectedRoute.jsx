import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const isAuthed = Boolean(storedUser);

  if (!isAuthed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
