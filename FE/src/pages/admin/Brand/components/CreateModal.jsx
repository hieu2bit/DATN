import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import BrandService from "../../../../services/BrandService";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchBrands }) {
    const [brandName, setBrandName] = useState("");

    const handleCreateBrand = async () => {
        if (!brandName.trim()) {
            toast.error("Tên thương hiệu không được để trống!");
            return;
        }

        try {
            await BrandService.createBrand({ brandName });
            toast.success("Thêm thương hiệu thành công!");
            fetchBrands(); // Load lại danh sách thương hiệu
            onConfirm(); // Đóng modal
            setBrandName(""); // Reset input
        } catch (error) {
            console.error("Lỗi khi tạo thương hiệu:", error);
            toast.error("Không thể thêm thương hiệu. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Thêm thương hiệu"
            className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm thương hiệu mới</h2>

            <input
                type="text"
                placeholder="Nhập tên thương hiệu"
                className="border bg-white text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                    onClick={onCancel}
                >
                    Hủy
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleCreateBrand}
                >
                    Thêm mới
                </button>
            </div>
        </Modal>
    );
}
