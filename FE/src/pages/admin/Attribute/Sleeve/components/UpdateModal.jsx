import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import SleeveService from "../../../../../services/SleeveService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, sleeve, fetchSleeves }) => {
    const [sleeveName, setSleeveName] = useState("");

    useEffect(() => {
        if (sleeve) {
            setSleeveName(sleeve.sleeveName);
        }
    }, [sleeve]);

    const handleUpdate = async () => {
        if (!sleeveName.trim()) {
            toast.error("Tên loại tay áo không được để trống!");
            return;
        }
        try {
            await SleeveService.updateSleeve(sleeve.id, { sleeveName });
            toast.success("Cập nhật loại tay áo thành công!");
            fetchSleeves(); // Load lại danh sách sau cập nhật
            setUpdateModal(false); // Đóng modal sau khi cập nhật thành công
        } catch (error) {
            console.error("Lỗi khi cập nhật loại tay áo:", error);
            toast.error("Không thể cập nhật loại tay áo. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setUpdateModal(false)}
            className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/3"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật loại tay áo</h2>

            <input
                type="text"
                className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sleeveName}
                onChange={(e) => setSleeveName(e.target.value)}
                placeholder="Nhập tên loại tay áo"
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
