import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Switch from "react-switch";
import MaterialService from "../../../services/MaterialService";
import { toast } from "react-toastify";
import UpdateModal from "./components/UpdateModal";
import CreateModal from "./components/CreateModal";

export default function Material() {
    const [materials, setMaterials] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "desc",
    });
    const [updateModal, setUpdateModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);

    const fetchMaterials = useCallback(async () => {
        try {
            const { content, totalPages } = await MaterialService.getAllMaterials(
                search,
                currentPage,
                pageSize,
                sortConfig.key,
                sortConfig.direction
            );
            setMaterials(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching materials:", error);
            toast.error("Lỗi khi tải danh sách chất liệu");
        }
    }, [search, currentPage, pageSize, sortConfig]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(0);
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prev) =>
            Math.max(0, Math.min(prev + direction, totalPages - 1))
        );
    };

    const handleUpdateMaterial = (material) => {
        setCurrentMaterial(material);
        setUpdateModal(true);
    };

    const handleToggleStatus = async (id) => {
        try {
            await MaterialService.toggleStatusMaterial(id);
            setMaterials((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: !item.status } : item
                )
            );
            toast.success("Cập nhật trạng thái chất liệu thành công!");
        } catch (error) {
            console.error("Error toggling material status:", error);
            toast.error("Không thể cập nhật trạng thái chất liệu.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Quản lý chất liệu</h1>
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm chất liệu"
                    className="border rounded-lg px-4 py-2 w-64"
                    value={search}
                    onChange={handleSearch}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    onClick={() => setCreateModal(true)}
                >
                    + Thêm mới
                </button>
            </div>
            <table className="table-auto w-full bg-white rounded-lg shadow text-center text-sm text-gray-500">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2">STT</th>
                        <th
                            className="px-4 py-2 cursor-pointer"
                            onClick={() => handleSort("materialName")}
                        >
                            Tên chất liệu
                        </th>
                        <th
                            className="px-4 py-2 cursor-pointer"
                            onClick={() => handleSort("status")}
                        >
                            Trạng thái
                        </th>
                        <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map((item, index) => (
                        <tr key={item.id} className="bg-white text-black text-xs hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{item.materialName}</td>
                            <td
                                className={`px-4 py-2 ${item.status ? "text-blue-500" : "text-red-500"}`}
                            >
                                {item.status ? "Kích hoạt" : "Không kích hoạt"}
                            </td>
                            <td className="px-4 py-2 flex justify-center gap-4">
                                <button
                                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                    onClick={() => handleUpdateMaterial(item)}
                                >
                                    <AiOutlineEdit size={20} />
                                </button>
                                <Switch
                                    onChange={() => handleToggleStatus(item.id)}
                                    checked={item.status}
                                    height={20}
                                    width={40}
                                    onColor="#1E90FF" // Sử dụng Dodger Blue làm ví dụ
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm">Xem</label>
                    <select
                        className="border rounded-lg px-2 py-1"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm">chất liệu</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 border rounded-lg"
                        onClick={() => handlePageChange(-1)}
                        disabled={currentPage === 0}
                    >
                        {"<"}
                    </button>
                    <span className="text-sm">
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        className="px-3 py-1 border rounded-lg"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        {">"}
                    </button>
                </div>
            </div>
            <UpdateModal
                isOpen={updateModal}
                setUpdateModal={setUpdateModal}
                material={currentMaterial}
                fetchMaterials={fetchMaterials}
            />
            <CreateModal
                isOpen={createModal}
                onConfirm={() => setCreateModal(false)}
                onCancel={() => setCreateModal(false)}
                fetchMaterials={fetchMaterials}
            />
        </div>
    );
}
