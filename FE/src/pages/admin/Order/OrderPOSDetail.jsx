import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";

// Các trạng thái hóa đơn POS
const orderStatusMap = {
  1: "Chờ thanh toán",
  5: "Hoàn thành",
};

// Tạo lớp CSS cho từng trạng thái
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

const OrderPOSDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await OrderService.getPOSOrderDetails(id);
        console.log("Order POS Response:", response);
        if (response) {
          console.log("Order Details:", response.orderDetails || []);
          setOrderDetails(response);
        } else {
          toast.error("Dữ liệu hóa đơn không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết hóa đơn POS:", error);
        toast.error("Lỗi khi tải chi tiết hóa đơn POS");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // Định dạng ngày giờ
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

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Tính tổng giá trị ban đầu (Đơn giá × Số lượng) trước khi giảm giá
  const calculateOriginalTotal = () => {
    if (!orderDetails?.orderDetails?.length) return 0;
    return orderDetails.orderDetails.reduce(
      (sum, detail) =>
        sum + (detail.quantity ?? 0) * (detail.productDetail?.salePrice ?? 0),
      0
    );
  };

  // Tính tổng giảm giá sản phẩm
  const calculateTotalDiscount = () => {
    if (!orderDetails?.orderDetails?.length) return 0;
    return orderDetails.orderDetails.reduce((sum, detail) => {
      const salePrice = detail.productDetail?.salePrice ?? 0;
      const importPrice = detail.productDetail?.importPrice ?? salePrice;
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
      return sum + discountAmount * (detail.quantity ?? 0);
    }, 0);
  };

  // Tính tổng tiền trước khi áp voucher
  const calculateTotalBeforeVoucher = () => {
    const originalTotal = calculateOriginalTotal();
    const totalDiscount = calculateTotalDiscount();
    return originalTotal; // Vì tổng thành tiền đã trừ giảm giá sản phẩm, nên tổng trước khi áp voucher là giá trị ban đầu
  };

  // Tính số tiền giảm giá từ voucher (nếu có)
  const calculateVoucherDiscount = () => {
    if (!orderDetails.voucher) return 0;
    const totalBeforeVoucher = calculateTotalBeforeVoucher();
    const totalBill = orderDetails.totalBill ?? 0;
    return totalBeforeVoucher > totalBill ? totalBeforeVoucher - totalBill : 0;
  };

  // Fix style cho in ấn
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
          content: "CỬA HÀNG Mộc Wear" !important;
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
            Không tìm thấy hóa đơn!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition no-print"
            onClick={() => navigate("/admin/order/pos")}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Chi tiết hóa đơn POS</h2>
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
                <p className="text-sm text-gray-500">Ngày tạo hóa đơn</p>
                <p className="font-medium">
                  {formatDate(orderDetails.createDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái hóa đơn</p>
                <p className="font-medium">
                  <span
                    className={getStatusClass(
                      parseInt(orderDetails?.statusOrder)
                    )}
                  >
                    {orderStatusMap[orderDetails?.statusOrder?.toString()] ||
                      "Đã hủy"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nhân viên</p>
                <p className="font-medium">
                  {orderDetails.employee?.fullname || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">
                  {orderDetails.paymentMethod === 1
                    ? "Chuyển khoản"
                    : "Tiền mặt"}
                </p>
              </div>
            </div>
          </div>

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
                    <th className="py-3 px-4 text-center">Màu sắc</th>
                    <th className="py-3 px-4 text-center">Size</th>
                    <th className="py-3 px-4 text-center">Cổ áo</th>
                    <th className="py-3 px-4 text-center">Tay áo</th>
                    <th className="py-3 px-4 text-right">Giá bán</th>
                    <th className="py-3 px-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-300">
                  {orderDetails?.orderDetails?.length > 0 ? (
                    orderDetails.orderDetails.map((detail, index) => {
                      console.log(`Render sản phẩm ${index + 1}:`, detail);
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
                        Không có sản phẩm nào trong hóa đơn
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100 text-gray-800 font-bold border-t">
                  <tr>
                    <td colSpan="7" className="py-4 px-4 text-right">
                      Tổng tiền trước khi áp voucher:
                    </td>
                    <td className="py-4 px-4 text-right text-xl text-gray-700">
                      {formatCurrency(
                        orderDetails?.orderDetails?.reduce((sum, detail) => {
                          const quantity = detail.quantity ?? 0;
                          const salePrice = detail.price ?? 0;
                          return sum + quantity * salePrice;
                        }, 0)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="7" className="py-4 px-4 text-right">
                      Số tiền giảm giá (voucher):
                    </td>
                    <td className="py-4 px-4 text-right text-xl text-green-600">
                      -
                      {formatCurrency(
                        orderDetails?.orderDetails?.reduce((sum, detail) => {
                          const quantity = detail.quantity ?? 0;
                          const salePrice = detail.price ?? 0;
                          return sum + quantity * salePrice;
                        }, 0) - (orderDetails?.totalBill ?? 0)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="7" className="py-4 px-4 text-right">
                      Tổng tiền sau khi áp voucher:
                    </td>
                    <td className="py-4 px-4 text-right text-xl text-red-600">
                      {formatCurrency(orderDetails?.totalBill ?? 0)}
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
                      <p>
                        {orderDetails.voucher?.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center no-print print:hidden">
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
              onClick={() => navigate("/admin/order/pos")}
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

export default OrderPOSDetail;
