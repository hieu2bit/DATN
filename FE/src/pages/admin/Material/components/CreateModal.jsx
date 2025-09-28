import React, { useState } from "react";
import Modal from "react-modal";
import MaterialService from "../../../../services/MaterialService";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchMaterials }) {
    const [materialName, setMaterialName] = useState("");

    const handleCreateMaterial = async () => {
        if (!materialName.trim()) {
            toast.error("Tên chất liệu không được để trống!");
            return;
        }

        try {
            await MaterialService.createMaterial({ materialName });
            toast.success("Thêm chất liệu thành công!");
            fetchMaterials();
            onConfirm(); // Đóng modal
            setMaterialName(""); // Reset input
        } catch (error) {
            toast.error("Thêm thất bại!");
        }
    };

    return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onCancel}
                contentLabel="Thêm chất liệu"
                className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm chất liệu mới</h2>
    
                <input
                    type="text"
                    placeholder="Nhập tên chất liệu"
                    className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
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
                        onClick={handleCreateMaterial}
                    >
                        Thêm mới
                    </button>
                </div>
            </Modal>
        );
    }
    
    
