import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../../service/AuthService";

function Wrapper({ children, allowedRoles }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getSessionAndRole = async () => {
      const session = await authService.getSession();

      if (session) {
        setAuthenticated(true);
        const role = await authService.getUserRole(session.user.id);
        setUserRole(role);
      }

      setLoading(false);
    };

    getSessionAndRole();
  }, []);

  //console.log(userRole);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default Wrapper;
