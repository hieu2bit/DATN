import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import SleeveService from "../../../../../services/SleeveService";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchSleeves }) {
    const [sleeveName, setSleeveName] = useState("");

    const handleCreateSleeve = async () => {
        if (!sleeveName.trim()) {
            toast.error("Tên loại tay áo không được để trống!");
            return;
        }

        try {
            await SleeveService.createSleeve({ sleeveName });
            toast.success("Thêm loại tay áo thành công!");
            fetchSleeves(); // Load lại danh sách sleeve sau khi thêm
            onConfirm(); // Đóng modal sau khi thêm thành công
            setSleeveName(""); // Reset input về rỗng
        } catch (error) {
            console.error("Lỗi khi tạo loại tay áo:", error);
            toast.error("Không thể thêm loại tay áo. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Thêm mới loại tay áo"
            className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm mới loại tay áo</h2>

            <input
                type="text"
                placeholder="Nhập tên loại tay áo"
                className="bg-gray-100 text-black border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sleeveName}
                onChange={(e) => setSleeveName(e.target.value)}
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
                    onClick={handleCreateSleeve}
                >
                    Thêm mới
                </button>
            </div>
        </Modal>
    );
}
