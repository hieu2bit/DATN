import React from "react";

const DeleteModal = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow p-6 w-96">
          <h2 className="text-xl mb-4">Xác nhận xóa sản phẩm</h2>
          <p className="mb-4">Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
          <div className="flex justify-end gap-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              onClick={onCancel}
            >
              Hủy
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={onConfirm}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default DeleteModal;