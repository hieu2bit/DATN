// src/services/OrderService.js
import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL = "api/order";
const API_URL_ORDER_ONLINE = "orders/online";
const API_URL_ORDER_POS = "orders/pos";

const OrderService = {
  // Lấy danh sách đơn hàng POS
  getPOSOrders: async (
    search = "",
    page = 0,
    size = 100,
    sortKey = "id",
    sortDirection = "desc"
  ) => {
    try {
      const params = { search, page, size, sortKey, sortDirection };
      const response = await api.get(API_URL_ORDER_POS, { params });
      console.log("Danh sách đơn hàng POS: ", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách đơn hàng POS:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy danh sách đơn hàng Online
  getOnlineOrders: async (
    search = "",
    page = 0,
    size = 10,
    sortKey = "id",
    sortDirection = "desc"
  ) => {
    try {
      const params = { search, page, size, sortKey, sortDirection };
      const response = await api.get(API_URL_ORDER_ONLINE, { params });
      console.log("Danh sách đơn hàng Online: ", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách đơn hàng Online:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái đơn hàng
  toggleStatusOrder: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái đơn hàng ${id} đã thay đổi:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái đơn hàng ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, orderData);
      console.log(`Đơn hàng ${id} đã cập nhật:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật đơn hàng ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới đơn hàng
  createOrder: async (orderData) => {
    try {
      const response = await api.post(API_URL, orderData);
      console.log("Đơn hàng đã tạo:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}/details`);
      console.log(`Chi tiết đơn hàng ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy chi tiết đơn hàng ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id, newStatus, note) => {
    try {
      console.log("Preparing to update order status:", { id, newStatus, note });
      const response = await api.put(
        `${API_URL_ORDER_ONLINE}/${id}/status`,
        null,
        {
          params: { newStatus, note },
        }
      );
      console.log(
        `Trạng thái đơn hàng online ${id} đã cập nhật thành ${newStatus}:`,
        response.data.data
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật trạng thái đơn hàng online ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy thông tin đơn hàng online theo ID
  getOnlineOrderById: async (id) => {
    try {
      const response = await api.get(`${API_URL_ORDER_ONLINE}/${id}`);
      console.log(`Thông tin đơn hàng online ${id}:`, response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy thông tin đơn hàng online ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng online theo ID
  getOnlineOrderDetails: async (id) => {
    try {
      const response = await api.get(`${API_URL_ORDER_ONLINE}/${id}/details`);
      console.log(`Chi tiết đơn hàng online ${id}:`, response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy chi tiết đơn hàng online ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng POS theo ID
  getPOSOrderDetails: async (id) => {
    try {
      const response = await api.get(`${API_URL_ORDER_POS}/${id}/details`);
      console.log(`Chi tiết đơn hàng POS ${id}:`, response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy chi tiết đơn hàng POS ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default OrderService;
