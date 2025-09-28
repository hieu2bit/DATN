import React from "react";
import { FaTimes } from "react-icons/fa";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100 animate-zoomIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="mb-8">
          {typeof message === "string" ? (
            <p className="text-lg text-gray-600 whitespace-pre-line leading-relaxed">
              {message}
            </p>
          ) : (
            <div className="text-lg text-gray-600 space-y-3 leading-relaxed">
              {message}
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 text-lg rounded-lg hover:bg-gray-300 transition-colors duration-200 shadow-sm"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            Xác nhận
          </button>
        </div>

        {/* CSS Keyframes cho hiệu ứng zoomIn */}
        <style jsx>{`
          @keyframes zoomIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-zoomIn {
            animation: zoomIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ConfirmModal;
