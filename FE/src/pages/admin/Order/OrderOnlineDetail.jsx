import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";

// Các trạng thái đơn hàng
const orderStatusMap = {
  "0": "Chờ xác nhận",
  "2": "Đã xác nhận",
  "3": "Đang giao hàng",
  "5": "Hoàn thành",
};

// Tạo lớp CSS cho từng trạng thái
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

// Component Timeline
const OrderTimeline = ({ currentStatus, fetchOrderDetails }) => {
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    console.log("Current Status:", currentStatus);
  }, [currentStatus]);

  // Mảng biểu tượng cho các trạng thái
  const statusIcons = {
    "0": (
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
    "2": (
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
    "3": (
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
    "5": (
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
  const handleConfirm = () => {
    setShowConfirmModal(false);
    setSelectedStatus(confirmStatus);
    setShowNoteInput(true);
    setNote("");
  };

  // Xử lý hủy từ modal
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmStatus(null);
  };

  // Xử lý gửi trạng thái mới
  const handleSubmitStatus = async () => {
    try {
      const updatedOrder = await fetchOrderDetails(selectedStatus, note);
      setShowNoteInput(false);
      setSelectedStatus(null);
      setNote("");
      if (selectedStatus == 2) {
        toast.success(
          "Đơn hàng đã được xác nhận và số lượng sản phẩm đã được trừ khỏi kho!"
        );
      } else {
        toast.success(
          `Cập nhật trạng thái thành ${orderStatusMap[selectedStatus]} thành công!`
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error(
        error.response?.data?.message ||
        "Lỗi khi cập nhật trạng thái. Vui lòng thử lại!"
      );
    }
  };

  // Định nghĩa luồng chạy chính
  const mainFlow = ["0", "2", "3", "5"];

  return (
    <div className="mb-8">
      {/* Timeline chính */}
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
                      ? status === "2"
                        ? "Xác nhận đơn hàng (trừ kho)"
                        : status === "5"
                          ? "Giao hàng thành công"
                          : `Chuyển sang ${orderStatusMap[status]}`
                      : "Không thể chuyển sang trạng thái này"
                  }
                >
                  {statusIcons[status]}
                </button>
                <span
                  className={`mt-2 text-sm font-medium ${nodeStatus === "current"
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

        {/* Ô nhập ghi chú */}
        {showNoteInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">
              Ghi chú cho trạng thái: {orderStatusMap[selectedStatus]}
            </h4>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập ghi chú (tùy chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowNoteInput(false);
                  setSelectedStatus(null);
                  setNote("");
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmitStatus}
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {/* Modal xác nhận */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {confirmStatus === "2"
                  ? "Bạn có muốn xác nhận đơn hàng không? Số lượng sản phẩm sẽ được trừ khỏi kho."
                  : confirmStatus === "5"
                    ? "Bạn có muốn ghi nhận giao hàng thành công không?"
                    : `Bạn có muốn chuyển trạng thái sang "${orderStatusMap[confirmStatus]}" không?`}
              </h3>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={handleCancelConfirm}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleConfirm}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await OrderService.getOnlineOrderDetails(id);
        console.log("Order Online Response:", response);
        if (response) {
          setOrderDetails(response);
        } else {
          toast.error("Dữ liệu đơn hàng không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
        toast.error("Lỗi khi tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async (newStatus, note) => {
    try {
      setIsFetching(true);
      await OrderService.updateOrderStatus(id, newStatus, note);
      const response = await OrderService.getOnlineOrderDetails(id);
      console.log("Refetched Order Online Response:", response);
      if (response) {
        setOrderDetails(response);
        return response; // Trả về dữ liệu đơn hàng để sử dụng trong handleSubmitStatus
      } else {
        toast.error("Dữ liệu đơn hàng không hợp lệ");
        throw new Error("Dữ liệu đơn hàng không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi tải lại chi tiết đơn hàng:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @media print {
      body {
        visibility: visible !important;
        background-color: white !important;
        font-family: Arial, sans-serif !important;
        color: #333 !important;
      }

      /* Ẩn các phần có class no-print */
      .no-print, .no-print * {
        display: none !important;
        visibility: hidden !important;
      }

      .container .bg-white.rounded-lg.shadow-lg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0;
        margin: 0;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      table {
        width: 100% !important;
        border-collapse: collapse !important;
        page-break-inside: auto !important;
      }

      table tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      table td, table th {
        border: 1px solid #ddd !important;
        padding: 6px 8px !important;
      }

      table thead {
        display: table-header-group !important;
      }

      table tfoot {
        display: table-footer-group !important;
      }

      .bg-white.rounded-lg.shadow-lg:before {
        content: "Cửa hàng Mộc Wear" !important;
        display: block;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
        color: #4a90e2;
      }

      .bg-white.rounded-lg.shadow-lg:after {
        content: "Địa chỉ: 123 Đường ABC, Quận XYZ, TP. MNV | Hotline: 0123 456 789 | Email: info@xyz.com";
        display: block;
        text-align: center;
        font-size: 12px;
        color: #7f8c8d;
        padding: 20px 0;
        border-top: 1px solid #ccc;
      }

      .grid {
        display: grid !important;
      }

      .md\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .gap-x-16 {
        column-gap: 4rem !important;
      }

      .gap-y-4 {
        row-gap: 1rem !important;
      }

      .flex {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 1rem !important;
      }

      @page {
        margin: 1cm !important;
        size: portrait;
      }
    }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border-t-4 border-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-500 font-bold text-xl mb-2">
            Không tìm thấy đơn hàng!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition no-print"
            onClick={() => navigate("/admin/order")}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    return isNaN(num)
      ? "N/A"
      : num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                {orderDetails.orderCode || "N/A"}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium">
                  {orderDetails.customer?.fullname || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">
                  {orderDetails.customer?.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium">{orderDetails.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium">
                  {formatDate(orderDetails.createDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái đơn hàng</p>
                <p className="font-medium">
                  <span
                    className={getStatusClass(
                      parseInt(orderDetails?.statusOrder)
                    )}
                  >
                    {orderStatusMap[orderDetails?.statusOrder?.toString()] ||
                      "Không xác định"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Timeline chỉ hiển thị cho đơn hàng online */}
          {orderDetails.kindOfOrder === false && (
            <div className="p-6 border-b no-print">
              <OrderTimeline
                currentStatus={orderDetails.statusOrder}
                fetchOrderDetails={fetchOrderDetails}
              />
            </div>
          )}

          {/* Order Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Các sản phẩm
            </h3>
            <div className="overflow-x-auto border rounded-lg shadow-md">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm font-semibold border-b">
                    <th className="py-3 px-4 text-left">Sản phẩm</th>
                    <th className="py-3 px-4 text-center">Số lượng</th>
                    <th className="py-3 px-4 text-center">Màu Sắc</th>
                    <th className="py-3 px-4 text-center">Size</th>
                    <th className="py-3 px-4 text-center">Cổ áo</th>
                    <th className="py-3 px-4 text-center">Tay áo</th>
                    <th className="py-3 px-4 text-right">Gía bán</th>
                    <th className="py-3 px-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-300">
                  {isFetching ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-3 px-4 text-center text-gray-500"
                      >
                        Đang tải sản phẩm...
                      </td>
                    </tr>
                  ) : Array.isArray(orderDetails?.orderDetails) &&
                    orderDetails.orderDetails.length > 0 ? (
                    orderDetails.orderDetails.map((detail, index) => {
                      const product = detail.productDetail?.product;
                      const productDetail = detail.productDetail || {};
                      const quantity = detail.quantity ?? 0;
                      const colorName =
                        detail.productDetail?.color?.name ?? "Không có màu";
                      const sizeName =
                        detail.productDetail?.size?.name ??
                        "Không có kích thước";
                      const collarName =
                        detail.productDetail?.collar?.name ?? "Không có cổ áo";
                      const sleeveName =
                        detail.productDetail?.sleeve?.sleeveName ??
                        "Không có tay áo";
                      const salePrice =
                        detail.productDetail?.salePrice ??
                        product?.salePrice ??
                        0;
                      const importPrice =
                        detail.productDetail?.importPrice ??
                        product?.importPrice ??
                        salePrice;
                      const promotionPercent =
                        detail.productDetail?.promotion?.promotionPercent ?? 0;
                      const discountPrice = promotionPercent
                        ? salePrice * (1 - promotionPercent / 100)
                        : salePrice;
                      const discountAmount =
                        importPrice > salePrice
                          ? importPrice - salePrice
                          : promotionPercent
                            ? salePrice - discountPrice
                            : 0;
                      const salePrice_orderDetail = detail.price ?? 0;
                      const totalPrice = salePrice_orderDetail * quantity;

                      return (
                        <tr
                          key={detail.id || index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {product?.productName || "Không có tên"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {productDetail.productDetailCode ||
                                  "Không có mã"}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {quantity}
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {colorName}
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {sizeName}
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {collarName}
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {sleeveName}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-green-600">
                            {formatCurrency(salePrice_orderDetail)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            {formatCurrency(totalPrice)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-3 px-4 text-center text-gray-500"
                      >
                        Không có sản phẩm nào trong đơn hàng
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100 text-gray-800 font-bold border-t">
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right">
                      Tổng tiền trước khi áp voucher:
                    </td>
                    <td
                      colSpan="3"
                      className="jihgpy-4 px-4 text-right text-xl text-gray-700"
                    >
                      {formatCurrency(orderDetails.totalAmount ?? 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right">
                      Phí giao hàng:
                    </td>
                    <td
                      colSpan="3"
                      className="py-4 px-4 text-right text-xl text-blue-600"
                    >
                      {formatCurrency(orderDetails.shipfee ?? 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right">
                      Số tiền giảm giá:
                    </td>
                    <td
                      colSpan="3"
                      className="py-4 px-4 text-right text-xl text-green-600"
                    >
                      -
                      {formatCurrency(
                        orderDetails.totalAmount +
                        (orderDetails.shipfee ?? 0) -
                        orderDetails.totalBill
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right">
                      Tổng tiền sau khi áp voucher:
                    </td>
                    <td
                      colSpan="3"
                      className="py-4 px-4 text-right text-xl text-red-600"
                    >
                      {formatCurrency(orderDetails.totalBill ?? 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Voucher Information */}
          {orderDetails.voucher && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Mã giảm giá đã áp dụng
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p className="font-medium">
                        {orderDetails.voucher?.voucherName || "Không có tên"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center no-print">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center"
              onClick={() => {
                setTimeout(() => window.print(), 100);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              In hóa đơn
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition flex items-center"
              onClick={() => navigate("/admin/order/online")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;