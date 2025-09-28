import api from "../ultils/api";

const API_URL = "/api/account";

const AccountService = {
  updateCustomerInfo: async ({ fullname, email, phone }) => {
    try {
      const response = await api.put(`${API_URL}/update-info`, {
        fullname,
        email,
        phone,
      });
      console.log("Thông tin khách hàng đã cập nhật:", response.data.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật thông tin khách hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateCustomerPassword: async ({ oldPassword, password }) => {
    try {
      const response = await api.put(`${API_URL}/update-password`, {
        oldPassword,
        password,
      });
      console.log("Mật khẩu khách hàng đã cập nhật:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật mật khẩu:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getCustomerAddresses: async () => {
    try {
      const response = await api.get(`${API_URL}/addresses`);
      console.log("Danh sách địa chỉ khách hàng:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách địa chỉ:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createAddress: async ({
    provinceId,
    provinceName,
    districtId,
    districtName,
    wardId,
    wardName,
    addressDetail,
  }) => {
    try {
      const response = await api.post(`${API_URL}/addresses`, {
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName,
        addressDetail,
      });
      console.log("Địa chỉ đã tạo:", response.data.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo địa chỉ:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`${API_URL}/addresses/${addressId}`);
      console.log(`Địa chỉ ${addressId} đã xóa:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi xóa địa chỉ ${addressId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default AccountService;
