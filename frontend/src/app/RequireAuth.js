import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
  const location = useLocation();
  const myInfoStr = localStorage.getItem("MyInfo");

  if (!myInfoStr) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const myInfo = JSON.parse(myInfoStr);
    if (!myInfo?.token) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  } catch (e) {
    localStorage.removeItem("MyInfo");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
