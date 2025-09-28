import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderService from "../../services/OrderService";
import { AiOutlineEye } from "react-icons/ai";
import LoginInfoService from "../../services/LoginInfoService";

// Order status mapping
const orderStatusMap = {
  0: "Chờ xác nhận",
  2: "Đã xác nhận",
  3: "Đang giao hàng",
  5: "Hoàn thành",
};

// Status CSS classes
const getStatusClass = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  return status === 0
    ? `${baseClasses} bg-yellow-100 text-yellow-800`
    : status === 2
      ? `${baseClasses} bg-cyan-100 text-green-800`
      : status === 3
        ? `${baseClasses} bg-purple-100 text-purple-800`
        : status === 5
          ? `${baseClasses} bg-green-100 text-green-800`
          : `${baseClasses} bg-green-100 text-green-800`;
};

// OrderTimeline Component
const OrderTimeline = ({ currentStatus, onCancelOrder }) => {
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    console.log("Current Status:", currentStatus);
  }, [currentStatus]);

  const statusIcons = {
    0: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    2: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    3: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
    ),
    5: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  // Hàm kiểm tra trạng thái hợp lệ để chuyển
  const isValidNextStatus = (currentStatus, nextStatus) => {
    const current = parseInt(currentStatus, 10);
    const next = parseInt(nextStatus, 10);
    console.log("Validating:", current, "->", next);

    if (isNaN(current) || isNaN(next)) return false;
    if (current === 5) return false;

    switch (current) {
      case 0:
        return next === 2;
      case 2:
        return next === 3;
      case 3:
        return next === 5;
      default:
        return false;
    }
  };

  // Xác định trạng thái node
  const getNodeStatus = (status, currentStatus) => {
    const current = parseInt(currentStatus, 10);
    const step = parseInt(status, 10);

    if (isNaN(current) || isNaN(step)) return "disabled";

    if (step === current) return "current";
    if (step < current || current === 5) return "completed";
    if (isValidNextStatus(currentStatus, status)) return "available";

    return "disabled";
  };

  // Lấy class cho node
  const getNodeClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500 shadow-lg shadow-green-200";
      case "current":
        return "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200 ring-4 ring-blue-100";
      case "available":
        return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";
      default:
        return "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
    }
  };

  // Lấy class cho connector
  const getConnectorClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
      case "available":
        return "bg-gray-300";
      default:
        return "bg-gray-200";
    }
  };

  // Xử lý khi nhấn vào trạng thái
  const handleStatusClick = (status) => {
    console.log(
      "Checking status transition:",
      currentStatus,
      "->",
      status,
      "Valid:",
      isValidNextStatus(currentStatus, status)
    );
    if (isValidNextStatus(currentStatus, status)) {
      setConfirmStatus(status);
      setShowConfirmModal(true);
    }
  };

  // Xử lý xác nhận từ modal
  const handleConfirm = async () => {
    setShowConfirmModal(false);
    try {
      await onCancelOrder(confirmStatus);
      toast.success(`Cập nhật trạng thái thành công: ${orderStatusMap[confirmStatus]}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái!");
    }
  };

  // Xử lý hủy từ modal
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmStatus(null);
  };

  const mainFlow = ["0", "2", "3", "5"];

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="flex items-center justify-between mb-12">
          {mainFlow.map((status, index) => {
            const nodeStatus = getNodeStatus(status, currentStatus);
            return (
              <div
                key={status}
                className="flex-1 flex flex-col items-center relative z-10"
              >
                <button
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-medium text-sm transition-all duration-300 ${getNodeClasses(
                    nodeStatus
                  )}`}
                  onClick={() => handleStatusClick(status)}
                  disabled={nodeStatus !== "available"}
                  title={
                    isValidNextStatus(currentStatus, status)
                      ? `Chuyển sang ${orderStatusMap[status]}`
                      : "Không thể chuyển sang trạng thái này"
                  }
                >
                  {statusIcons[status]}
                </button>
                <span
                  className={`mt-2 text-sm font-medium ${
                    nodeStatus === "current"
                      ? "text-blue-600"
                      : nodeStatus === "completed"
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  {orderStatusMap[status]}
                </span>
                {index < mainFlow.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-1 ${getConnectorClasses(
                      getNodeStatus(mainFlow[index + 1], currentStatus)
                    )}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Mô tả trạng thái hiện tại */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Trạng thái hiện tại: {orderStatusMap[currentStatus]}
          </h4>
          <p className="text-sm text-gray-600">
            {parseInt(currentStatus) === 0
              ? "Đơn hàng đang chờ được xác nhận. Số lượng sản phẩm chưa được trừ."
              : parseInt(currentStatus) === 2
                ? "Đơn hàng đã được xác nhận và số lượng sản phẩm đã được trừ khỏi kho."
                : parseInt(currentStatus) === 3
                  ? "Đơn hàng đang được giao đến địa chỉ của bạn."
                  : "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!"}
          </p>
        </div>
      </div>
    </div>
  );
};

const UserOrder = () => {
  const { isLoggedIn, role } = useSelector((state) => state.user);
  const [allOrders, setAllOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { key: "all", label: "Tất cả", status: null },
    { key: "awaiting_confirmation", label: "Chờ xác nhận", status: 0 },
    { key: "confirmed", label: "Đã xác nhận", status: 2 },
    { key: "transporting", label: "Đang giao hàng", status: 3 },
    { key: "completed", label: "Hoàn thành", status: 5 },
  ];

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isLoggedIn || role !== "CUSTOMER") return;
      try {
        const customerData = await LoginInfoService.getCurrentUser();
        console.log("Customer data:", customerData);
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Không thể tải thông tin khách hàng!");
      }
    };
    fetchCustomerData();
  }, [isLoggedIn, role]);

  const fetchOrders = async () => {
    if (!customer?.phone) {
      console.warn("No customer phone available");
      return;
    }
    try {
      setIsLoading(true);
      console.log("Fetching all orders with search:", search);
      const response = await OrderService.getOnlineOrders(
        search,
        0,
        1000,
        "id",
        "desc"
      );
      console.log("API response:", response);

      const filteredOrders = (response.content || []).filter(
        (order) => order.customer?.phone === customer.phone
      );
      console.log("Filtered orders by phone:", filteredOrders);
      setAllOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(`Không thể tải danh sách đơn hàng: ${error.message}`);
      setAllOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customer?.phone && isLoggedIn && role === "CUSTOMER") {
      fetchOrders();
    }
  }, [customer, isLoggedIn, role, search]);

  useEffect(() => {
    if (!customer?.phone || !isLoggedIn || role !== "CUSTOMER") return;

    const intervalId = setInterval(async () => {
      console.log("Polling for order status updates...");
      try {
        const response = await OrderService.getOnlineOrders(
          search,
          0,
          1000,
          "id",
          "desc"
        );
        const filteredOrders = (response.content || []).filter(
          (order) => order.customer?.phone === customer.phone
        );

        const updatedOrders = filteredOrders.filter((newOrder) =>
          allOrders.some(
            (oldOrder) =>
              oldOrder.id === newOrder.id &&
              oldOrder.statusOrder !== newOrder.statusOrder
          )
        );

        if (updatedOrders.length > 0) {
          updatedOrders.forEach((order) => {
            toast.info(
              `Đơn hàng #${order.orderCode} đã được cập nhật thành ${orderStatusMap[order.statusOrder]}!`
            );
          });
          setAllOrders(filteredOrders);
        }
      } catch (error) {
        console.error("Error polling orders:", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [allOrders, customer, isLoggedIn, role, search]);

  useEffect(() => {
    const status = tabs.find((tab) => tab.key === activeTab)?.status;
    console.log(
      "Filtering orders with status:",
      status,
      "currentPage:",
      currentPage
    );

    let filteredOrders = allOrders;
    if (status !== null) {
      filteredOrders = allOrders.filter(
        (order) => Number(order.statusOrder) === status
      );
    }
    console.log("Filtered orders by status:", filteredOrders);

    const totalFiltered = filteredOrders.length;
    const newTotalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
      return;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedOrders = filteredOrders.slice(
      startIndex,
      startIndex + pageSize
    );
    console.log("Paginated orders:", paginatedOrders);

    setDisplayedOrders(paginatedOrders);
  }, [allOrders, activeTab, currentPage, pageSize]);

  const handleViewOrderDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const orderDetails = await OrderService.getOnlineOrderDetails(orderId);
      console.log("Order details:", orderDetails);
      setSelectedOrder(orderDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    console.log("Switched to tab:", tabKey);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      setCurrentPage(page);
      console.log("Page changed to:", page);
    }
  };

  const handleCancelOrder = async (newStatus) => {
    try {
      setIsLoading(true);
      await OrderService.updateOrderStatus(selectedOrder.id, newStatus);
      const updatedOrder = await OrderService.getOnlineOrderDetails(
        selectedOrder.id
      );
      setSelectedOrder(updatedOrder);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.length > 0 ? pageNumbers : [1];
  };

  const formatCurrency = (amount) => {
    return amount || amount === 0
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)
      : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "CUSTOMER") {
      toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
      navigate("/login");
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "CUSTOMER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-red-600">
          Vui lòng đăng nhập!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Lịch sử mua hàng
        </h1>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white border-blue-500"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative flex items-center bg-white rounded-lg shadow p-2">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 text-sm border-none focus:ring-0"
            />
          </div>
        </form>

        {/* Order List */}
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 14h6" />
              <path d="M9 10h6" />
              <path d="M9 18h6" />
            </svg>
            <div className="text-gray-500 text-lg font-semibold mt-2">
              Chưa có đơn hàng
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày đặt hàng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedOrders.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.orderCode || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.createDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">
                      {formatCurrency(item.totalBill)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={getStatusClass(item.statusOrder)}>
                        {orderStatusMap[item.statusOrder?.toString()] || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1"
                        onClick={() => handleViewOrderDetails(item.id)}
                        disabled={isLoading}
                      >
                        <AiOutlineEye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {displayedOrders.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mt-6 flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                className={`p-2 border rounded-md ${
                  currentPage === 1 || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={`p-2 border rounded-md ${
                  currentPage === 1 || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                -
              </button>
              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  disabled={currentPage === number || isLoading}
                  className={`p-2 border rounded-md min-w-[40px] ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={`p-2 border rounded-md ${
                  currentPage === totalPages || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                +
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading}
                className={`p-2 border rounded-md ${
                  currentPage === totalPages || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                »
              </button>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full p-6 overflow-y-auto max-h-[95vh] shadow-2xl">
              {/* Modal Header */}
              <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Chi tiết đơn hàng #{selectedOrder.orderCode || "N/A"}
                </h2>
                <div className="flex items-center gap-4">
                  <span className={getStatusClass(selectedOrder.statusOrder)}>
                    {orderStatusMap[selectedOrder.statusOrder?.toString()] ||
                      "N/A"}
                  </span>
                  <button
                    className="text-white hover:text-gray-200 focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Họ và tên
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customer?.fullname || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Số điện thoại
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.phone || "N/A"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 font-medium">
                      Địa chỉ giao hàng
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Ngày đặt hàng
                    </p>
                    <p className="text-gray-800">
                      {formatDate(selectedOrder.createDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Phương thức thanh toán
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.paymentMethod === 1
                        ? "Thanh toán khi nhận hàng"
                        : selectedOrder.paymentMethod === 2
                          ? "Thanh toán online"
                          : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="p-6 border-b border-gray-200">
                <OrderTimeline
                  currentStatus={selectedOrder.statusOrder?.toString() || "0"}
                  onCancelOrder={handleCancelOrder}
                />
              </div>

              {/* Products Table */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Chi tiết sản phẩm
                </h3>
                <div className="overflow-x-auto border rounded-lg shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                      <tr>
                        <th className="py-3 px-4 text-center w-16">Ảnh</th>
                        <th className="py-3 px-4 text-left">Sản phẩm</th>
                        <th className="py-3 px-4 text-center w-20">Số lượng</th>
                        <th className="py-3 px-4 text-center w-20">Màu sắc</th>
                        <th className="py-3 px-4 text-center w-20">Size</th>
                        <th className="py-3 px-4 text-center">Cổ áo</th>
                        <th className="py-3 px-4 text-center">Tay áo</th>
                        <th className="py-3 px-4 text-right w-24">Gía bán</th>
                        <th className="py-3 px-4 text-right w-24">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Array.isArray(selectedOrder.orderDetails) &&
                      selectedOrder.orderDetails.length > 0 ? (
                        selectedOrder.orderDetails.map((detail, index) => {
                          const product = detail.productDetail?.product || {};
                          const productDetail = detail.productDetail || {};
                          const quantity = detail.quantity || 0;
                          const colorName = productDetail.color?.name || "N/A";
                          const collarName =
                            detail.productDetail?.collar?.name ??
                            "Không có cổ áo";
                          const sleeveName =
                            detail.productDetail?.sleeve?.sleeveName ??
                            "Không có tay áo";
                          const sizeName = productDetail.size?.name || "N/A";
                          const salePrice =
                            productDetail.salePrice || product.salePrice || 0;
                          const promotionPercent =
                            productDetail.promotion?.promotionPercent || 0;
                          const discountPrice = promotionPercent
                            ? salePrice * (1 - promotionPercent / 100)
                            : salePrice;
                          const discountAmount = promotionPercent
                            ? salePrice - discountPrice
                            : 0;
                          const salePrice_orderDetail = detail.price ?? 0;
                          const totalPrice = salePrice_orderDetail * quantity;
                          const photo =
                            productDetail.photo ||
                            product.photo ||
                            "/src/assets/default.jpg";

                          return (
                            <tr
                              key={detail.id || index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="py-3 px-4 text-center">
                                <img
                                  src={photo}
                                  alt={product.productName || "Sản phẩm"}
                                  className="w-12 h-12 object-cover rounded-md mx-auto"
                                  onError={(e) =>
                                    (e.target.src =
                                      "/src/assets/default.jpg")
                                  }
                                />
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-medium text-gray-800">
                                  {product.productName || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {productDetail.productDetailCode || "N/A"}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {quantity}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {colorName}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {sizeName}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {collarName}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {sleeveName}
                              </td>
                              <td className="py-3 px-4 text-right text-green-600">
                                {formatCurrency(salePrice_orderDetail)}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-gray-800">
                                {formatCurrency(totalPrice)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="10"
                            className="py-4 px-4 text-center text-gray-500"
                          >
                            Không có sản phẩm
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold text-gray-800">
                      <tr>
                        <td colSpan="7" className="py-4 px-4 text-right">
                          Tổng tiền hàng:
                        </td>
                        <td colSpan="3" className="py-4 px-4 text-right">
                          {formatCurrency(selectedOrder.totalAmount || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7" className="py-4 px-4 text-right">
                          Phí giao hàng:
                        </td>
                        <td
                          colSpan="3"
                          className="py-4 px-4 text-right text-blue-600"
                        >
                          {formatCurrency(selectedOrder.shipfee || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7" className="py-4 px-4 text-right">
                          Giảm giá hóa đơn:
                        </td>
                        <td
                          colSpan="3"
                          className="py-4 px-4 text-right text-green-600"
                        >
                          -
                          {formatCurrency(
                            (selectedOrder.totalAmount || 0) +
                              (selectedOrder.shipfee || 0) -
                              (selectedOrder.totalBill || 0)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7" className="py-4 px-4 text-right">
                          Tổng thanh toán:
                        </td>
                        <td
                          colSpan="3"
                          className="py-4 px-4 text-right text-red-600 font-bold"
                        >
                          {formatCurrency(selectedOrder.totalBill || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Voucher Section */}
              {selectedOrder.voucher && (
                <div className="p-6 border-t border-gray-200">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-green-500 mr-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-green-800">
                          Mã giảm giá:{" "}
                          {selectedOrder.voucher?.voucherName || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.voucher?.description || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-6 flex justify-end">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;