import api from "../ultils/api"; // Import instance Axios đã cấu hình từ api.js

const API_URL = "/api/sleeve"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const SleeveService = {
  // Lấy danh sách tay áo
  getAllSleeves: async (
    search = "",
    page = 0,
    size = 100,
    sortBy = "id",
    sortDir = "asc"
  ) => {
    try {
      const response = await api.get(API_URL, {
        params: { search, page, size, sortBy, sortDir },
      });
      console.log("Danh sách tay áo: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách tay áo:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy tay áo theo ID
  getSleeveById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Tay áo ${id}:`, response.data);
      return response.data; // Trả về dữ liệu tay áo
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy tay áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới tay áo
  createSleeve: async (sleeveCreateRequest) => {
    try {
      const response = await api.post(API_URL, sleeveCreateRequest);
      console.log("Tay áo đã tạo:", response.data);
      return response.data; // Trả về dữ liệu tay áo vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo tay áo:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật tay áo
  updateSleeve: async (id, sleeveUpdateRequest) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, sleeveUpdateRequest);
      console.log(`Tay áo ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu tay áo đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật tay áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Xóa tay áo
  deleteSleeve: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      console.log(`Tay áo ${id} đã xóa:`, response.data);
      return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
      console.error(
        `❌ Lỗi khi xóa tay áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái tay áo
  toggleStatusSleeve: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái tay áo ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái tay áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default SleeveService;
