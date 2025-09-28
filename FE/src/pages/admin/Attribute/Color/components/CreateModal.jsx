import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ColorService from "../../../../../services/ColorService";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchColors }) {
    const [name, setColorName] = useState("");

    const handleCreateColor = async () => {
        if (!name.trim()) {
            toast.error("Tên loại màu sắc không được để trống!");
            return;
        }

        try {
            await ColorService.createColor({ name });
            toast.success("Thêm loại màu sắc thành công!");
            fetchColors(); // Load lại danh sách color
            onConfirm(); // Đóng modal
            setColorName(""); // Reset input
        } catch (error) {
            console.error("Lỗi khi tạo loại màu sắc:", error);
            toast.error("Không thể thêm loại màu sắc. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Thêm loại màu sắc"
            className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm loại màu sắc mới</h2>

            <input
                type="text"
                placeholder="Nhập tên loại màu sắc"
                className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setColorName(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    onClick={onCancel}
                >
                    Hủy
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleCreateColor}
                >
                    Thêm mới
                </button>
            </div>
        </Modal>
    );
}
