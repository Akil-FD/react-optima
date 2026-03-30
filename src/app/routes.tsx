import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardHome from "../features/dashboard/pages/dashboard-home";
import Registration from "../features/auth/pages/registration";
import { useAppSelector } from "../store/hooks";
import { PATH } from "../utils/constant";

const ProtectedLayout = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to={PATH.REGISTER} replace />;
    }

    return <Outlet />;
};

const PublicOnlyLayout = () => {
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // If already logged in → go to dashboard
  if (isAuthenticated) {
    return <Navigate to={PATH.DASHBOARD} replace />;
  }

  return <Outlet />;
};


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to={PATH.REGISTER} replace />} />

        {/* Public Only Routes */}
        <Route element={<PublicOnlyLayout />}>
          <Route path={PATH.REGISTER} element={<Registration />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path={PATH.DASHBOARD} element={<DashboardHome />} />
        </Route>

        <Route path="*" element={<Navigate to={PATH.REGISTER} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;