import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL = "/api/brand"; // Chỉ giữ đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const BrandService = {
  // Lấy danh sách thương hiệu với xử lý lỗi
  getAllBrands: async (
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
      console.log("Danh sách thương hiệu: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách thương hiệu:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy thương hiệu theo ID
  getBrandById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data; // Trả về dữ liệu thương hiệu
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy thương hiệu ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới thương hiệu
  createBrand: async (brandData) => {
    try {
      const response = await api.post(API_URL, brandData);
      console.log("Thương hiệu đã tạo:", response.data);
      return response.data; // Trả về dữ liệu thương hiệu vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo thương hiệu:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật thương hiệu
  updateBrand: async (id, brandData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, brandData);
      console.log(`Thương hiệu ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu thương hiệu đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật thương hiệu ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái thương hiệu
  toggleStatusBrand: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái thương hiệu ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái thương hiệu ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default BrandService;
