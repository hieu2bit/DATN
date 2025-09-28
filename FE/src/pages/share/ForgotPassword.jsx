import React, { useState } from "react";
import AuthService from "../../services/AuthService";

const ForgotPasswordForm = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await AuthService.forgetPassword(usernameOrEmail);
      setMessage(response.message || "Yêu cầu đặt lại mật khẩu đã được gửi.");
    } catch (err) {
      setError(err.message || "Không thể yêu cầu đặt lại mật khẩu.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Quên mật khẩu</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên đăng nhập hoặc Email
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="Nhập tên đăng nhập hoặc email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
