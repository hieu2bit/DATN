import React, { useState, useEffect } from 'react';
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from "react-icons/ai";
import AuthService from "../../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra localStorage (đã lưu user ở đó sau khi login)
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      
      if (user?.token && user?.role) {
        if (user.role === "ADMIN" || user.role === "STAFF") {
          navigate("/admin/salePOS");
        } else {
          navigate("/home");
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage('');

    try {
        const credentials = { username: loginInput, password };
        const response = await AuthService.login(credentials, rememberMe);
        
        // Kiểm tra role từ response
        const role = response?.data?.role;
        console.log("Role:", role); // In ra role để kiểm tra

        // Điều hướng theo role
        if (role === "ADMIN" || role === "STAFF") {
            window.location.href = "/admin/salePOS";
        } else {
            window.location.href= "/home";
        }
    } catch (error) {
        setErrorMessage(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
};


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-20"></div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-32 h-32 mb-8 rounded-full bg-white p-2 shadow-lg">
            <img 
              src="/src/assets/z6737412753522_56e64e962c6114e6dbb2406d51d47da3.jpg" 
              alt="Men'sFashion Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h1 className="text-5xl font-bold text-white mb-6">Men'sFashion MộcWear</h1>
          <p className="text-xl text-blue-100 text-center max-w-md">
            Nền tảng mua sắm trực tuyến hàng đầu với những sản phẩm chất lượng
          </p>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600 opacity-20"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Chào mừng trở lại Mộc Wear</h2>
            <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineUser className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Nhập tên đăng nhập"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineLock className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {showPassword ? 
                      <AiOutlineEyeInvisible className="h-5 w-5" /> : 
                      <AiOutlineEye className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-all duration-200"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Quên mật khẩu?{" "}
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Nhấn vào đây
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;