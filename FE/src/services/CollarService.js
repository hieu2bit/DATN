import api from "../ultils/api"; // Import instance Axios đã cấu hình từ api.js

const API_URL = "/api/collars"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const CollarService = {
  // Lấy danh sách cổ áo
  getAllCollars: async (
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
      console.log("Danh sách cổ áo: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách cổ áo:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy cổ áo theo ID
  getCollarById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Cổ áo ${id}:`, response.data);
      return response.data; // Trả về dữ liệu cổ áo
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy cổ áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới cổ áo
  createCollar: async (collarData) => {
    try {
      const response = await api.post(API_URL, collarData);
      console.log("Cổ áo đã tạo:", response.data);
      return response.data; // Trả về dữ liệu cổ áo vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo cổ áo:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật cổ áo
  updateCollar: async (id, collarData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, collarData);
      console.log(`Cổ áo ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu cổ áo đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật cổ áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái cổ áo
  toggleStatusCollar: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái cổ áo ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái cổ áo ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default CollarService;
