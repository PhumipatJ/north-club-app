import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../../../supabaseClient";

function Wrapper({ children, allowedRoles }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setAuthenticated(true);
        
        // Fetch user role from Supabase
        const { data: userData, error } = await supabase
          .from("user")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && userData) {
          setUserRole(userData.role);
        }
      }

      setLoading(false);
    };

    getSessionAndRole();
  }, []);

  console.log(userRole);
  
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
