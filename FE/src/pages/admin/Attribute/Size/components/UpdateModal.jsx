import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import  SizeService from "../../../../../services/SizeService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, size, fetchSizes }) => {
    const [name, setSizeName] = useState("");

    useEffect(() => {
        if (size) {
            setSizeName(size.name);
        }
    }, [size]);

    const handleUpdate = async () => {
        if (!name.trim()) {
            toast.error("Tên kích thước không được để trống!");
            return;
        }
        try {
            await SizeService.updateSize(size.id, { name });
            toast.success("Cập nhật kích thước thành công!");
            fetchSizes();
            setUpdateModal(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật kích thước:", error);
            toast.error("Không thể cập nhật kích thước. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setUpdateModal(false)}
            className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật kích thước</h2>
            <input
                type="text"
                className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setSizeName(e.target.value)}
                placeholder="Nhập tên kích thước"
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
