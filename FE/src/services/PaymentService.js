import api from "../ultils/api"; // Sử dụng api từ api.js

const PayService = {
  // ✅ Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const formattedOrderData = {
        voucherId: orderData.voucherId || null,
        paymentMethod: orderData.paymentMethod,
        phone: orderData.phone,
        address: orderData.address,
        shipfee: orderData.shipfee ?? 0.0,
        orderOnlineDetails: orderData.orderOnlineDetails.map((item) => ({
          productDetailId: item.productDetailId,
          quantity: item.quantity,
        })),
      };

      console.log("formattedOrderData:", formattedOrderData);

      const response = await api.post(`/orders/create`, formattedOrderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // ✅ Tạo URL thanh toán cho đơn hàng
  async createPaymentUrl(orderId) {
    try {
      const response = await api.post(`/payment/create-payment-url/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error creating payment URL:", error);
      throw error;
    }
  },
};

export default PayService;
