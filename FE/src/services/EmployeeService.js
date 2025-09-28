import api from "../ultils/api"; // Sử dụng api từ api.js

const EmployeeService = {
  async getAll(
    page = 0,
    size = 100,
    search = "",
    trangThai = null,
    sortKey = "id",
    sortDirection = "desc"
  ) {
    try {
      const validSortKeys = [
        "id",
        "employeeCode",
        "fullname",
        "username",
        "email",
        "phone",
      ];
      if (!validSortKeys.includes(sortKey)) {
        sortKey = "id";
      }

      const params = {
        page,
        size,
        search,
        sortBy: sortKey,
        sortDir: sortDirection,
      };

      if (trangThai !== null && !isNaN(trangThai)) {
        params.trangThai = parseInt(trangThai, 10);
      }

      const response = await api.get(`/api/employees`, { params });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/api/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee data:", error);
      throw error;
    }
  },

  async add(employeeCreateRequest) {
    try {
      const response = await api.post(`/api/employees`, employeeCreateRequest);
      return response.data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  async update(id, employeeUpdateRequest) {
    try {
      const response = await api.put(
        `/api/employees/${id}`,
        employeeUpdateRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  async updatePassword(id, passwordUpdateRequest) {
    try {
      const response = await api.put(
        `/api/employees/${id}/change-password`,
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
      const response = await api.patch(`/api/employees/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error("Error toggling employee status:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/api/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  async resetPassword(id) {
    try {
      const response = await api.post(`/api/employees/reset-password/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },
};

export default EmployeeService;
