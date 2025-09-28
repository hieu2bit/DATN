import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LayoutAdmin from "../layout/AdminLayout/Layout";
import adminRoutes from "./AdminRouter";
import UserMain from "../layout/UserLayout/Layout";
import UserRouter from "./UserRouter";

// Import trang Login và Unauthorized
import Login from "../pages/share/Login";
import Unauthorized from "../pages/share/Unauthorized";
import ForgotPasswordForm from "../pages/share/ForgotPassword";
import RegisterForm from "../pages/share/Register";

function AppRouter() {
  const { isLoggedIn, role } = useSelector((state) => state.user);

  console.log("User Role:", role);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Route Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              isLoggedIn && (role === "ADMIN" || role === "STAFF") ? (
                <LayoutAdmin />
              ) : (
                <Navigate
                  to={isLoggedIn ? "/unauthorized" : "/login"}
                  replace
                />
              )
            }
          >
            {adminRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>

          {/* User Routes */}
          <Route
            path="/"
            element={
              isLoggedIn && (role === "CUSTOMER" || role === "ADMIN") ? (
                <UserMain />
              ) : (
                <Navigate
                  to={isLoggedIn ? "/unauthorized" : "/login"}
                  replace
                />
              )
            }
          >
            {UserRouter.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
