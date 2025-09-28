import React, { useState, useEffect, useCallback } from "react";
import PromotionService from "../../../../services/PromotionServices";
import Switch from "react-switch";
import { toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import CreatePromotionModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

// Hàm định dạng thời gian sang yyyy-MM-dd HH:mm:ss
const formatDateTime = (date) => {
  if (isNaN(date.getTime())) return null; // Kiểm tra nếu date không hợp lệ
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [percentRange, setPercentRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotions = useCallback(async () => {
    try {
      const startDateFormatted = dateRange.start
        ? formatDateTime(new Date(dateRange.start))
        : null;
      const endDateFormatted = dateRange.end
        ? formatDateTime(new Date(dateRange.end))
        : null;

      const { content, totalPages } = await PromotionService.getAllPromotions(
        search || "",
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction,
        startDateFormatted,
        endDateFormatted,
        percentRange.min ? Number(percentRange.min) : null,
        percentRange.max ? Number(percentRange.max) : null,
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : null
      );

      setPromotions(content || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khuyến mãi", error);
      toast.error("Lỗi khi tải dữ liệu khuyến mãi");
      setPromotions([]);
      setTotalPages(1);
    }
  }, [
    search,
    currentPage,
    pageSize,
    sortConfig,
    dateRange,
    percentRange,
    statusFilter,
  ]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0);
  };

  const handleDateFilter = (field) => (event) => {
    const value = event.target.value;
    console.log(`Input ${field}_date:`, value); // Thêm console log để hiển thị giá trị start_date hoặc end_date
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handlePercentFilter = (field) => (event) => {
    const value = event.target.value;
    setPercentRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDateRange({ start: "", end: "" });
    setPercentRange({ min: "", max: "" });
    setStatusFilter("");
    setCurrentPage(0);
  };

  const handleUpdatePromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setUpdateModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await PromotionService.toggleStatusBrand(id);
      setPromotions((prev) => prev.map((item) =>
        (item.id === id ? { ...item, status: !item.status } : item)
      ));
      toast.success("Thay đổi trạng thái khuyến mãi thành công!");
    } catch (error) {
      console.error("Error toggling brand status:", error);
      toast.error(
        "Không thể thay đổi trạng thái khuyến mãi. Vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Quản lý khuyến mãi</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên khuyến mãi"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phần trăm giảm
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={percentRange.min}
                onChange={handlePercentFilter("min")}
                min="0"
                max="100"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={percentRange.max}
                onChange={handlePercentFilter("max")}
                min="0"
                max="100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">Tất cả</option>
              <option value="active">Kích hoạt</option>
              <option value="inactive">Không kích hoạt</option>
            </select>
          </div>
          <div className="mt-4 flex justify-between items-center gap-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              onClick={handleResetFilters}
            >
              Bỏ lọc
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Thêm mới
            </button>
          </div>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow-lg text-centerborder-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-500">
            <th className="px-4 py-3 rounded-tl-lg">STT</th>
            <th className="px-4 py-3">Tên KM</th>
            <th className="px-4 py-3">Mô tả</th>
            <th className="px-4 py-3">Phần trăm giảm</th>
            <th className="px-4 py-3">Ngày và giờ bắt đầu</th>
            <th className="px-4 py-3">Ngày và giờ kết thúc</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 rounded-tr-lg">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions
            .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
            .map((item, index) => {
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);
              return (
                <tr
                  key={item.id}
                  className="bg-white text-black hover:bg-gray-50 text-xs text-center"
                >
                  <td className="px-4 py-3">
                    {currentPage * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    {item.promotionName}
                  </td>
                  <td className="px-4 py-3">
                    {item.description}
                  </td>
                  <td className="px-4 py-3">{item.promotionPercent}%</td>
                  <td className="px-4 py-3">
                    {startDate.toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {endDate.toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </td>
                  <td
                    className={`px-4 py-3 ${item.status ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {item.status ? "Kích hoạt" : "Không kích hoạt"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                        onClick={() => handleUpdatePromotion(item)}
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
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm text-gray-700">
            Xem
          </label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">Khuyến mãi</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {totalPages > 0
              ? `Trang ${currentPage + 1} / ${totalPages}`
              : "Không có dữ liệu"}
          </span>
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1 || totalPages === 0}
          >
            {">"}
          </button>
        </div>
      </div>

      <CreatePromotionModal
        isOpen={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        fetchPromotions={fetchPromotions}
      />
      <UpdateModal
        isOpen={updateModal}
        setUpdateModal={setUpdateModal}
        fetchPromotions={fetchPromotions}
        selectedPromotion={selectedPromotion}
      />
    </div>
  );
}
