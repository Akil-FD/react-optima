import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardHome from "../features/dashboard/pages/dashboard-home";
import Registration from "../features/auth/pages/registration";
import { useAppSelector } from "../store/hooks";
import type React from "react";
import { PATH } from "../utils/constant";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to={PATH.REGISTER} />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/register" replace />} />
                <Route path="/register" element={<Registration />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardHome />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
