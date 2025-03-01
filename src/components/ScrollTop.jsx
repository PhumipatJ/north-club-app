import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname]);

  return null;
};

export default ScrollTop;