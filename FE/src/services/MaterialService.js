import api from "../ultils/api"; // Import instance Axios đã cấu hình từ api.js

const API_URL = "/api/material"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const MaterialService = {
  // Lấy danh sách chất liệu
  getAllMaterials: async (
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
      console.log("Danh sách chất liệu: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách chất liệu:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy chất liệu theo ID
  getMaterialById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Chất liệu ${id}:`, response.data);
      return response.data; // Trả về dữ liệu chất liệu
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy chất liệu ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới chất liệu
  createMaterial: async (materialData) => {
    try {
      const response = await api.post(API_URL, materialData);
      console.log("Chất liệu đã tạo:", response.data);
      return response.data; // Trả về dữ liệu chất liệu vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo chất liệu:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật chất liệu
  updateMaterial: async (id, materialData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, materialData);
      console.log(`Chất liệu ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu chất liệu đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật chất liệu ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái chất liệu
  toggleStatusMaterial: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái chất liệu ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái chất liệu ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default MaterialService;
