import api from "../ultils/api"; // Sử dụng api từ api.js

const AddressService = {
  async getById(id) {
    try {
      const response = await api.get(`/api/addresses/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  },

  async getByCustomerId(customerId) {
    try {
      const response = await api.get(`/api/addresses/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer addresses:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await api.post(`/api/addresses`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  },
};

export default AddressService;
