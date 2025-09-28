import React, { useState, useEffect } from "react";
import {
  AiOutlineEye,
  AiFillCaretUp,
  AiFillCaretDown,
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineReload,
} from "react-icons/ai";
import { FaPrint } from "react-icons/fa";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Chỉ giữ hai trạng thái cho hóa đơn POS
const orderStatusMap = {
  '-1': "Đã hủy",
  1: "Chờ thanh toán",
  5: "Hoàn thành",
};

const getStatusClass = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 5: // Hoàn thành
      return `${baseClasses} bg-green-100 text-green-800`;
    case -1: // Đã hủy
      return `${baseClasses} bg-red-100 text-red-800`;
    case 1: // Chờ thanh toán
      return `${baseClasses} bg-blue-100 text-blue-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`; // Trạng thái mặc định (nếu có)
  }
};

export default function OrderPOS() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, sortConfig]);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, orders, search]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await OrderService.getPOSOrders(
        search,
        currentPage - 1,
        pageSize,
        sortConfig.key,
        sortConfig.direction
      );

      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setFilteredOrders(data.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu hóa đơn POS:", error);
      toast.error("Lỗi khi tải dữ liệu hóa đơn POS");
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    if (selectedStatus !== null) {
      filtered = filtered.filter(
        (order) => order.statusOrder.toString() === selectedStatus
      );
    }
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter((order) =>
        Object.values(order).some((value) => {
          if (value !== null && value !== undefined) {
            if (typeof value === "object" && value.fullname) {
              return value.fullname.toLowerCase().includes(searchTerm);
            }
            return value.toString().toLowerCase().includes(searchTerm);
          }
          return false;
        })
      );
    }
    setFilteredOrders(filtered);
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSearch("");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handlePrint = (orderId) => {
    toast.info(`In hóa đơn ${orderId}`);
  };

  // Tính STT dựa trên trang hiện tại và kích thước trang
  const getSTT = (index) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Quản lý hóa đơn POS
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý và theo dõi tất cả hóa đơn tại quầy
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center"
            >
              <AiOutlineReload className="mr-2" /> Làm mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 p-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50 transition"
              >
                <AiOutlineFilter className="mr-2" /> Bộ lọc
              </button>
              {(selectedStatus !== null || search.trim()) && (
                <button
                  onClick={handleClearFilters}
                  className="ml-2 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Lọc theo trạng thái:
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(orderStatusMap).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleStatusFilter(key)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedStatus === key
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {orderStatusMap[key]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>Không tìm thấy hóa đơn POS nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold tracking-wider cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-left space-x-1">
                        <span>STT</span>
                        {sortConfig.key === "id" &&
                          (sortConfig.direction === "asc" ? (
                            <AiFillCaretUp/>
                          ) : (
                            <AiFillCaretDown/>
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider cursor-pointer"
                      onClick={() => handleSort("orderCode")}
                    >
                      <div className="flex items-left space-x-1">
                        <span>Mã hóa đơn</span>
                        {sortConfig.key === "orderCode" &&
                          (sortConfig.direction === "asc" ? (
                            <AiFillCaretUp/>
                          ) : (
                            <AiFillCaretDown/>
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Khách hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Nhân viên
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Tổng tiền hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Tổng tiền khách phải trả
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Phương thức thanh toán
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Số lượng SP
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider"
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {getSTT(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">
                          {item.orderCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          {item.customer?.fullname || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          {item.employee?.fullname || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-700 font-medium">
                        {formatCurrency(item.originalTotal || item.totalBill)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-700 font-medium">
                        {formatCurrency(item.totalBill)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          {item.paymentMethod === 1
                            ? "Chuyển khoản"
                            : "Tiền mặt"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-xs font-medium">
                          {item.totalAmount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={getStatusClass(item.statusOrder)}>
                          {orderStatusMap[item.statusOrder.toString()] ||
                            "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                            onClick={() =>
                              navigate(`/admin/order/pos/${item.id}/details`)
                            }
                          >
                            <AiOutlineEye size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalElements > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border border-gray-300 rounded-md text-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-700 hidden sm:inline">
                  Trang <span className="font-medium">{currentPage}</span> /{" "}
                  <span className="font-medium">{totalPages}</span> (Tổng:{" "}
                  {totalElements})
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-4 sm:mt-0">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 border rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  &laquo;
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 border rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  &lt;
                </button>
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`p-2 border rounded-md min-w-[40px] ${
                      currentPage === number
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 border rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  &gt;
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 border rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
