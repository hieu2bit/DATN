import React, { useEffect } from "react";
import "./App.css";
import AppRouter from "./routers/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "./services/AuthService";

function App() {
  useEffect(() => {
    AuthService.restoreUserSession(); // ✅ Khôi phục trạng thái đăng nhập
  }, []);

  return (
    <div data-theme="light">
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
