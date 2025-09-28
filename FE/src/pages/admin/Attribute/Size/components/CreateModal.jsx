import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import SizeService from "../../../../../services/SizeService";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchSizes }) {
    const [name, setSizeName] = useState("");

    const handleCreateSize = async () => {
        if (!name.trim()) {
            toast.error("Tên kích thước không được để trống!");
            return;
        }

        try {
            await SizeService.createSize({ name });
            toast.success("Thêm kích thước thành công!");
            fetchSizes(); // Load lại danh sách size
            onConfirm(); // Đóng modal
            setSizeName(""); // Reset input
        } catch (error) {
            console.error("Lỗi khi tạo kích thước:", error);
            toast.error("Không thể thêm kích thước. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Thêm kích thước"
            className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm kích thước mới</h2>

            <input
                type="text"
                placeholder="Nhập tên kích thước"
                className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setSizeName(e.target.value)}
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
                    onClick={handleCreateSize}
                >
                    Thêm mới
                </button>
            </div>
        </Modal>
    );
}
