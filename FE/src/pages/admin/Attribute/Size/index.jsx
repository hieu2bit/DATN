import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import Switch from "react-switch";
import SizeService from "../../../../services/SizeService";
import { toast } from "react-toastify";
import UpdateModal from "./components/UpdateModal";
import CreateModal from "./components/CreateModal";

export default function Size() {
  const [sizes, setSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [updateModal, setUpdateModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);

  const fetchSizes = useCallback(async () => {
    try {
      const { content, totalPages } = await SizeService.getAllSizes(
        search,
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction
      );
      setSizes(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu kích thước");
    }
  }, [search, currentPage, pageSize, sortConfig]);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

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
    setCurrentPage((prev) => Math.max(0, Math.min(prev + direction, totalPages - 1)));
  };

  const handleUpdateSize = (size) => {
    setCurrentSize(size);
    setUpdateModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await SizeService.toggleStatusSize(id);
      setSizes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: !item.status } : item))
      );
      toast.success("Thay đổi trạng thái thành công!");
    } catch (error) {
      console.error("Error toggling Size status:", error);
      toast.error("Không thể thay đổi trạng thái. Vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý kích thước</h1>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm kích thước"
          className="border rounded-lg px-4 py-2 w-64 focus:ring-blue-500"
          value={search}
          onChange={handleSearch}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" onClick={() => setCreateModal(true)}>
          + Thêm mới
        </button>
      </div>
      <table className="table-auto w-full bg-white rounded-lg shadow text-center">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-500">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("sizeName")}>
              Tên kích thước
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("status")}>
              Trạng thái
            </th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((item, index) => (
            <tr key={item.id} className="bg-white text-black hover:bg-gray-50 text-xs">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className={`px-4 py-2 ${item.status ? "text-blue-500" : "text-red-500"}`}>
                {item.status ? "Kích hoạt" : "Không kích hoạt"}
              </td>
              <td className="px-4 py-2 flex justify-center gap-4">
                <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors" onClick={() => handleUpdateSize(item)}>
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
          <label htmlFor="entries" className="text-sm">Xem</label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm">kích thước</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded-lg" onClick={() => handlePageChange(-1)} disabled={currentPage === 0}>
            {"<"}
          </button>
          <span className="text-sm">Trang {currentPage + 1} / {totalPages}</span>
          <button className="px-3 py-1 border rounded-lg" onClick={() => handlePageChange(1)} disabled={currentPage === totalPages - 1}>
            {">"}
          </button>
        </div>
      </div>
      <UpdateModal isOpen={updateModal} setUpdateModal={setUpdateModal} size={currentSize} fetchSizes={fetchSizes} />
      <CreateModal isOpen={createModal} onConfirm={() => setCreateModal(false)} onCancel={() => setCreateModal(false)} fetchSizes={fetchSizes} />
    </div>
  );
}