
import { Navigate } from "react-router-dom";

const Index = () => {
  const user = { role: 'admin' }; // Mock user object

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default Index;
