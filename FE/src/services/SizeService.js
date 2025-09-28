import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL = "/api/sizes"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const SizeService = {
  // Lấy danh sách kích thước
  getAllSizes: async (
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
      console.log("Danh sách kích thước: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách kích thước:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy kích thước theo ID
  getSizeById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Kích thước ${id}:`, response.data);
      return response.data; // Trả về dữ liệu kích thước
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy kích thước ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới kích thước
  createSize: async (sizeCreateRequest) => {
    try {
      const response = await api.post(API_URL, sizeCreateRequest);
      console.log("Kích thước đã tạo:", response.data);
      return response.data; // Trả về dữ liệu kích thước vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo kích thước:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật kích thước
  updateSize: async (id, sizeUpdateRequest) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, sizeUpdateRequest);
      console.log(`Kích thước ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu kích thước đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật kích thước ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái kích thước
  toggleStatusSize: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái kích thước ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái kích thước ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default SizeService;
