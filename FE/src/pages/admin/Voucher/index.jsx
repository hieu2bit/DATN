import React, { useState, useEffect, useCallback } from "react";
import VoucherService from "../../../services/VoucherServices";
import CustomerService from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import Switch from "react-switch";
import CreateVoucherModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

const formatDateTime = (date) => {
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [percentFilter, setPercentFilter] = useState("");
  const [minConditionFilter, setMinConditionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");

  const updateVoucherStatus = useCallback(async (voucher) => {
    if (!voucher.status) {
      return false;
    }

    const currentDate = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    const shouldBeActive = currentDate >= startDate && currentDate <= endDate;

    if (shouldBeActive !== voucher.status) {
      try {
        await VoucherService.toggleStatusVoucher(voucher.id);
        return true;
      } catch (error) {
        console.error("Auto status update error:", error);
        return false;
      }
    }
    return false;
  }, []);

  const fetchVouchers = useCallback(async () => {
    try {
      const startDateFormatted = dateFilter.startDate
        ? formatDateTime(new Date(dateFilter.startDate))
        : null;
      const endDateFormatted = dateFilter.endDate
        ? formatDateTime(new Date(dateFilter.endDate))
        : null;

      const statusValue =
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : null;

      const response = await VoucherService.getAllVouchers(
        search,
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction,
        startDateFormatted,
        endDateFormatted,
        percentFilter ? Number(percentFilter) : null,
        minConditionFilter ? Number(minConditionFilter) : null,
        statusValue
      );

      let filteredVouchers = response.content.map((voucher) => ({
        ...voucher,
        voucherName: voucher.voucherName || "",
      }));

      const updatedVouchers = await Promise.all(
        filteredVouchers.map(async (voucher) => {
          const statusUpdated = await updateVoucherStatus(voucher);
          if (statusUpdated) {
            return { ...voucher, status: !voucher.status };
          }
          return voucher;
        })
      );

      setVouchers(updatedVouchers);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch vouchers");
      setVouchers([]);
      setTotalPages(1);
    }
  }, [
    search,
    currentPage,
    pageSize,
    sortConfig,
    dateFilter,
    percentFilter,
    minConditionFilter,
    statusFilter,
    updateVoucherStatus,
  ]);

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAll("", 0, 1000);
      const normalizedCustomers = response.content.map((customer) => ({
        ...customer,
        fullname: customer.fullname || "",
        email: customer.email || "",
      }));
      setCustomers(normalizedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Không thể tải danh sách khách hàng");
    }
  };

  useEffect(() => {
    fetchVouchers();
    const interval = setInterval(fetchVouchers, 60000);
    fetchCustomers();
    return () => clearInterval(interval);
  }, [fetchVouchers]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0);
  };

  const handleDateFilter = (event) => {
    setDateFilter({
      ...dateFilter,
      [event.target.name]: event.target.value,
    });
    setCurrentPage(0);
  };

  const handlePercentFilter = (event) => {
    setPercentFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleMinConditionFilter = (event) => {
    setMinConditionFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDateFilter({ startDate: "", endDate: "" });
    setPercentFilter("");
    setMinConditionFilter("");
    setStatusFilter("");
    setCurrentPage(0);
  };

  const handleUpdateVoucher = (voucher) => {
    setCurrentVoucher(voucher);
    setUpdateModal(true);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      Math.max(0, Math.min(prev + direction, totalPages - 1))
    );
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!currentStatus) {
      const voucher = vouchers.find((v) => v.id === id);
      const endDate = new Date(voucher.endDate);
      const currentDate = new Date();
      if (currentDate > endDate) {
        toast.error(
          "Kích hoạt thất bại. Vui lòng sửa lại ngày bắt đầu hoặc kết thúc để kích hoạt."
        );
        return;
      }
    }

    try {
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher.id === id ? { ...voucher, status: !currentStatus } : voucher
        )
      );
      await VoucherService.toggleStatusVoucher(id);
      toast.success(
        currentStatus
          ? "Voucher đã được tắt và sẽ không tự động kích hoạt lại cho đến khi bạn bật lại."
          : "Cập nhật trạng thái thành công"
      );
      await fetchVouchers();
    } catch (error) {
      console.error("Toggle error:", error);
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher.id === id ? { ...voucher, status: currentStatus } : voucher
        )
      );
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleOpenEmailModal = (voucher) => {
    setSelectedVoucher(voucher);
    setSelectedCustomerIds([]);
    setCustomerSearch("");
    setEmailModalOpen(true);
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAllCustomers = () => {
    const filteredCustomers = customers
      .filter((customer) => customer.email)
      .filter(
        (customer) =>
          (customer.fullname &&
            customer.fullname
              .toLowerCase()
              .includes(customerSearch.toLowerCase())) ||
          (customer.email &&
            customer.email.toLowerCase().includes(customerSearch.toLowerCase()))
      );
    const allCustomerIds = filteredCustomers.map((customer) => customer.id);
    setSelectedCustomerIds(allCustomerIds);
  };

  const handleDeselectAllCustomers = () => {
    setSelectedCustomerIds([]);
  };

  const handleCustomerSearch = (event) => {
    setCustomerSearch(event.target.value);
  };

  const handleSendEmail = async () => {
    if (selectedCustomerIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khách hàng!");
      return;
    }

    const selectedCustomers = customers.filter((c) =>
      selectedCustomerIds.includes(c.id)
    );
    const invalidCustomers = selectedCustomers.filter((c) => !c.email);

    if (invalidCustomers.length > 0) {
      toast.error(
        "Có khách hàng không có email: " +
        invalidCustomers.map((c) => c.fullname || "Không tên").join(", ")
      );
      return;
    }

    try {
      const emailData = {
        voucherId: selectedVoucher.id,
        fromEmail: "aduc79176@gmail.com",
        toEmails: selectedCustomers.map((c) => c.email),
        voucherCode: selectedVoucher.voucherCode,
        voucherName: selectedVoucher.voucherName,
        minCondition: selectedVoucher.minCondition,
        maxDiscount: selectedVoucher.maxDiscount,
        reducedPercent: selectedVoucher.reducedPercent,
        startDate: selectedVoucher.startDate,
        endDate: selectedVoucher.endDate,
      };

      console.log("Dữ liệu gửi email:", emailData);
      await VoucherService.sendVoucherEmail(emailData);
      toast.success(
        `Đã gửi voucher ${selectedVoucher.voucherCode} đến ${selectedCustomerIds.length} khách hàng từ aduc79176@gmail.com`
      );
      setEmailModalOpen(false);
      setSelectedCustomerIds([]);
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response?.data || error.message
      );
      toast.error("Không thể gửi email. Vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Quản lý voucher</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo mã hoặc tên"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phần trăm giảm từ
            </label>
            <input
              type="number"
              placeholder="0 - 100"
              min="0"
              value={percentFilter}
              onChange={handlePercentFilter}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điều kiện tối thiểu từ
            </label>
            <input
              type="number"
              placeholder="Số tiền"
              min="0"
              value={minConditionFilter}
              onChange={handleMinConditionFilter}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
          <div className="mt-4 flex justify-between items-center">
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
              + Thêm Voucher
            </button>
          </div>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow-lg text-centerborder-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-500">
            <th className="px-4 py-3 rounded-tl-lg">STT</th>
            <th className="px-4 py-3">Mã Voucher</th>
            <th className="px-4 py-3">Tên Voucher</th>
            <th className="px-4 py-3">Mô tả</th>
            <th className="px-4 py-3">Điều kiện tối thiểu</th>
            <th className="px-4 py-3">Giảm tối đa</th>
            <th className="px-4 py-3">Phần trăm giảm</th>
            <th className="px-4 py-3">Ngày bắt đầu</th>
            <th className="px-4 py-3">Ngày kết thúc</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 rounded-tr-lg">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((item, index) => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            return (
              <tr
                key={item.id}
                className="bg-white text-black hover:bg-gray-50 text-xs text-center"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  {item.voucherCode}
                </td>
                <td className="px-4 py-3">{item.voucherName}</td>
                <td className="px-4 py-3">
                  {item.description}
                </td>
                <td className="px-4 py-3">
                  {item.minCondition.toLocaleString()}đ
                </td>
                <td className="px-4 py-3">
                  {item.maxDiscount.toLocaleString()}đ
                </td>
                <td className="px-4 py-3">{item.reducedPercent}%</td>
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
                  <div className="flex justify-center items-center gap-3 min-w-[120px]">
                    <button
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                      onClick={() => handleUpdateVoucher(item)}
                      title="Chỉnh sửa"
                    >
                      <AiOutlineEdit size={20} />
                    </button>
                    <Switch
                      onChange={() => handleToggleStatus(item.id, item.status)}
                      checked={item.status}
                      height={20}
                      width={40}
                      onColor="#1E90FF"
                    />
                    <div className="w-5">
                      {item.status && (
                        <button
                          className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 transition-colors"
                          onClick={() => handleOpenEmailModal(item)}
                          title="Gửi email"
                        >
                          <AiOutlineMail size={20} />
                        </button>
                      )}
                    </div>
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
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">voucher</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50"
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <span className="text-sm text-gray-700">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>

      <Modal
        isOpen={emailModalOpen}
        onRequestClose={() => setEmailModalOpen(false)}
        contentLabel="Gửi voucher qua email"
      className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Gửi Voucher qua Email
        </h2>
        {selectedVoucher && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã Voucher:</label>
                <input
                  type="text"
                  value={selectedVoucher.voucherCode}
                  className="border rounded-lg px-4 py-2 w-full bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên Voucher:</label>
                <input
                  type="text"
                  value={selectedVoucher.voucherName}
                  className="border rounded-lg px-4 py-2 w-full bg-gray-100"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Từ Email:</label>
              <input
                type="text"
                value="Hệ Thống"
                className="border rounded-lg px-4 py-2 w-full bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chọn khách hàng:
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email"
                  value={customerSearch}
                  onChange={handleCustomerSearch}
                  className="w-full bg-white text-black border p-2 rounded-lg mb-2focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 mb-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-150"
                  onClick={handleSelectAllCustomers}
                >
                  Chọn tất cả
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-150"
                  onClick={handleDeselectAllCustomers}
                >
                  Bỏ chọn tất cả
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
                {customers
                  .filter((customer) => customer.email)
                  .filter(
                    (customer) =>
                      (customer.fullname &&
                        customer.fullname
                          .toLowerCase()
                          .includes(customerSearch.toLowerCase())) ||
                      (customer.email &&
                        customer.email
                          .toLowerCase()
                          .includes(customerSearch.toLowerCase()))
                  )
                  .map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCustomerIds.includes(customer.id)}
                        onChange={() => handleCustomerSelect(customer.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>
                        {customer.fullname || "Không tên"} ({customer.email})
                      </span>
                    </div>
                  ))}
              </div>
              <p className="text-sm text-gray-700 mt-1">
                Đã chọn: {selectedCustomerIds.length} khách hàng
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setEmailModalOpen(false)}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleSendEmail}
          >
            Gửi Email
          </button>
        </div>
      </Modal>

      <CreateVoucherModal
        isOpen={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        fetchVouchers={fetchVouchers}
      />
      <UpdateModal
        isOpen={updateModal}
        setUpdateModal={setUpdateModal}
        fetchVouchers={fetchVouchers}
        selectedVoucher={currentVoucher}
      />
    </div>
  );
}
