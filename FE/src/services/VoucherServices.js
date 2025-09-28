import api from "../ultils/api";

const API_URL = "/api/vouchers";

const VoucherService = {
  getAllVouchers: async (
    search = "",
    page = 0,
    size = 100,
    sortBy = "id",
    sortDir = "asc",
    startDate = null,
    endDate = null,
    reducedPercent = null,
    minCondition = null,
    status = null
  ) => {
    try {
      const response = await api.get(API_URL, {
        params: {
          search,
          page,
          size,
          sortBy,
          sortDir,
          startDate,
          endDate,
          reducedPercent,
          minCondition,
          status,
        },
      });
      console.log("Danh sách voucher: ", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách voucher:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getVoucherById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Voucher ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy voucher ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const response = await api.post(API_URL, voucherData);
      console.log("Voucher đã tạo:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo voucher:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateVoucher: async (id, voucherData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, voucherData);
      console.log(`Voucher ${id} đã cập nhật:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật voucher ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  toggleStatusVoucher: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái voucher ${id} đã thay đổi:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái voucher ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  sendVoucherEmail: async (emailData) => {
    try {
      const response = await api.post("/api/send-voucher-email", emailData);
      console.log("Email đã gửi:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi gửi email:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default VoucherService;
