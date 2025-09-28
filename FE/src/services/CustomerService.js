import api from "../ultils/api"; // Sử dụng api từ api.js

const CustomerService = {
  async getAll(
    search = "",
    page = 0,
    size = 100,
    sortBy = "id",
    sortDir = "desc"
  ) {
    try {
      const validSortKeys = [
        "id",
        "customerCode",
        "fullname",
        "username",
        "email",
        "phone",
        "createDate",
      ];
      if (!validSortKeys.includes(sortBy)) {
        sortBy = "id";
      }

      const params = {
        search,
        page,
        size,
        sortBy,
        sortDir,
      };

      const response = await api.get(`/api/customers`, { params });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/api/customers/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching customer data:", error);
      throw error;
    }
  },

  async add(data) {
    try {
      const response = await api.post(`/api/customers`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/api/customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },

  async updatePassword(id, passwordUpdateRequest) {
    try {
      const response = await api.put(
        `/api/customers/${id}/change-password`,
        passwordUpdateRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  async toggleStatus(id) {
    try {
      const response = await api.patch(`/api/customers/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error("Error toggling customer status:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  },
};

export default CustomerService;
