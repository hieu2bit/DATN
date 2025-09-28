import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL = "/api/promotion"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const PromotionService = {
  // Lấy danh sách khuyến mãi
  getAllPromotions: async (
    search = "",
    page = 0,
    size = 100,
    sortBy = "id",
    sortDir = "asc",
    startDate = null,
    endDate = null,
    minPercent = null,
    maxPercent = null,
    status = null
  ) => {
    try {
      console.log("Gửi request với params:", {
        search,
        page,
        size,
        sortBy,
        sortDir,
        startDate,
        endDate,
        minPercent,
        maxPercent,
        status,
      });
      const response = await api.get(API_URL, {
        params: {
          search,
          page,
          size,
          sortBy,
          sortDir,
          startDate, // Thêm tham số startDate
          endDate, // Thêm tham số endDate
          minPercent,
          maxPercent,
          status, // Thêm tham số status để khớp với BE
        },
      });
      console.log("Danh sách khuyến mãi: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách khuyến mãi:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy khuyến mãi theo ID
  getPromotionById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Khuyến mãi ${id}:`, response.data);
      return response.data; // Trả về dữ liệu khuyến mãi
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy khuyến mãi ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới khuyến mãi
  createPromotion: async (promotionData) => {
    try {
      const response = await api.post(API_URL, promotionData);
      console.log("Khuyến mãi đã tạo:", response.data);
      return response.data; // Trả về dữ liệu khuyến mãi vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo khuyến mãi:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật khuyến mãi
  updatePromotion: async (id, promotionData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, promotionData);
      console.log(`Khuyến mãi ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu khuyến mãi đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật khuyến mãi ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Xóa khuyến mãi
  deletePromotion: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      console.log(`Khuyến mãi ${id} đã xóa:`, response.data);
      return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
      console.error(
        `❌ Lỗi khi xóa khuyến mãi ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái khuyến mãi
  toggleStatusBrand: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái khuyến mãi ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái khuyến mãi ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default PromotionService;
