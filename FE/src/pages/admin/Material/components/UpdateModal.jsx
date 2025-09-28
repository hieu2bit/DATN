import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import MaterialService from "../../../../services/MaterialService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, material, fetchMaterials }) => {
    const [materialName, setMaterialName] = useState("");

    useEffect(() => {
            if (material) {
                setMaterialName(material.materialName);
            }
        }, [material]);

    const handleUpdate = async () => {
        if (!materialName.trim()) {
            toast.error("Tên chất liệu không được để trống!");
            return;
        }
        try {
            await MaterialService.updateMaterial(material.id, { materialName });
            toast.success("Cập nhật thành công!");
            fetchMaterials();
            setUpdateModal(false);
        } catch (error) {
            toast.error("Cập nhật thất bại!");
        }
    };

     return (
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setUpdateModal(false)}
                className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật chất liệu</h2>
                <input
                    type="text"
                    className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Nhập tên chất liệu"
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={() => setUpdateModal(false)}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={handleUpdate}
                    >
                        Cập nhật
                    </button>
                </div>
            </Modal>
        );
    };

    export default UpdateModal;