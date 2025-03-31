import { useState, useEffect } from "react";
import { Navigate, useLocation , useParams} from "react-router-dom";
import authService from "../../service/AuthService";
import Loading from "../loading";
function Wrapper({ children, allowedRoles, prohibitedClubPosition }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { clubId } = useParams();
  const [clubPosition, setclubPosition] = useState(null);

  useEffect(() => {
    const getSessionAndRole = async () => {
      const session = await authService.getSession();

      if (session) {
        setAuthenticated(true);
        const role = await authService.getUserRole(session.user.id);
        setUserRole(role);

        const clubPosition = await authService.getUniqueUserClubPosition(session.user.email,clubId);
        setclubPosition(clubPosition);
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    getSessionAndRole();
  }, []);

  //console.log(prohibitedClubPosition);
  
  if (loading) {
    return <Loading/>;
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    //window.location.reload();
    return <Navigate to="/" />;
  }

  if(prohibitedClubPosition !== null && clubPosition === prohibitedClubPosition){
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default Wrapper;
