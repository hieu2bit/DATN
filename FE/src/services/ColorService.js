import api from "../ultils/api"; // Import instance Axios đã cấu hình từ api.js

const API_URL = "/api/colors"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const ColorService = {
  // Lấy danh sách màu sắc
  getAllColors: async (
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
      console.log("Danh sách màu sắc: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách màu sắc:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy màu sắc theo ID
  getColorById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Màu sắc ${id}:`, response.data);
      return response.data; // Trả về dữ liệu màu sắc
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy màu sắc ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới màu sắc
  createColor: async (colorData) => {
    try {
      const response = await api.post(API_URL, colorData);
      console.log("Màu sắc đã tạo:", response.data);
      return response.data; // Trả về dữ liệu màu sắc vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo màu sắc:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật màu sắc
  updateColor: async (id, colorData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, colorData);
      console.log(`Màu sắc ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu màu sắc đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật màu sắc ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái màu sắc
  toggleStatusColor: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái màu sắc ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái màu sắc ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default ColorService;
