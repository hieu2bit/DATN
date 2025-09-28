import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const Toast = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Tự động đóng thông báo sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Khi isVisible thay đổi, gọi onClose sau khi hiệu ứng biến mất hoàn tất
  useEffect(() => {
    if (!isVisible) {
      const fadeOutTimer = setTimeout(() => {
        onClose();
      }, 300); // Thời gian khớp với duration của hiệu ứng fadeOut
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible, onClose]);

  // Xác định màu sắc, gradient và icon dựa trên type
  const toastStyles = {
    success: "bg-gradient-to-r from-green-500 to-green-600 border-green-700",
    error: "bg-gradient-to-r from-red-500 to-red-600 border-red-700",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700",
  };

  const icons = {
    success: <FaCheckCircle className="text-white" size={20} />,
    error: <FaExclamationCircle className="text-white" size={20} />,
    info: <FaInfoCircle className="text-white" size={20} />,
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-2xl text-white font-sans transition-opacity duration-300 ${
        isVisible ? "opacity-100 animate-slideIn" : "opacity-0 animate-fadeOut"
      } ${toastStyles[type] || "bg-gradient-to-r from-gray-500 to-gray-600 border-gray-700"}`}
      style={{ minWidth: "320px", maxWidth: "450px" }}
    >
      {/* Icon trạng thái */}
      <div className="flex-shrink-0">
        {icons[type] || <FaInfoCircle className="text-white" size={20} />}
      </div>

      {/* Nội dung thông báo */}
      <div className="flex-1 text-base font-medium leading-tight">
        {message}
      </div>

      {/* Nút đóng */}
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
      >
        <FaTimes size={16} />
      </button>

      {/* Thanh tiến trình */}
      <div
        className={`absolute bottom-0 left-0 h-1 rounded-b-xl ${toastStyles[type].split(" ")[0]} animate-progressBar`}
        style={{ width: "100%" }}
      ></div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in forwards;
        }

        .animate-progressBar {
          animation: progressBar 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
