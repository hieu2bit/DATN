import api from "../ultils/api";

const LoginInfoService = {
  async getCurrentUser() {
    try {
      const response = await api.get("/auth/current-user");

      const user = response.data.data;
      return user;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw (
        error.response?.data || {
          message: "Không thể lấy thông tin người dùng.",
        }
      );
    }
  },

  async getCurrentUserAddresses() {
    try {
      const response = await api.get("/auth/current-user/addresses");

      return response.data.data || [];
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ người dùng:", error);
      throw (
        error.response?.data || { message: "Không thể lấy địa chỉ người dùng." }
      );
    }
  },

  async updateCurrentUser(data) {
    try {
      const response = await api.put("/auth/update-current-user", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default LoginInfoService;
