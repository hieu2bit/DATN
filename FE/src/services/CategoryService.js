import api from "../ultils/api"; // Import instance Axios đã cấu hình từ api.js

const API_URL = "/api/categories"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const CategoryService = {
  // Lấy danh sách danh mục
  getAll: async (
    page = 0,
    size = 100,
    search = "",
    sortKey = "id",
    sortDirection = "asc"
  ) => {
    try {
      const validSortKeys = ["id", "name", "status"];
      if (!validSortKeys.includes(sortKey)) {
        sortKey = "id"; // Mặc định về "id" nếu sortKey không hợp lệ
      }

      const params = {
        page,
        size,
        search,
        sortBy: sortKey,
        sortDir: sortDirection,
      };

      const response = await api.get(API_URL, { params });
      console.log("Danh sách danh mục: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách danh mục:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy danh mục theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Danh mục ${id}:`, response.data);
      return response.data; // Trả về dữ liệu danh mục
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy danh mục ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Thêm danh mục mới
  add: async (categoryCreateRequest) => {
    try {
      const response = await api.post(API_URL, categoryCreateRequest);
      console.log("Danh mục đã tạo:", response.data);
      return response.data; // Trả về dữ liệu danh mục vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo danh mục:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật danh mục
  update: async (id, categoryUpdateRequest) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, categoryUpdateRequest);
      console.log(`Danh mục ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu danh mục đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật danh mục ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái danh mục
  toggleStatus: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái danh mục ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái danh mục ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Xóa danh mục
  delete: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      console.log(`Danh mục ${id} đã xóa:`, response.data);
      return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
      console.error(
        `❌ Lỗi khi xóa danh mục ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default CategoryService;
