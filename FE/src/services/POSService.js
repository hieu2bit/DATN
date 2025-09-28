import api from "../ultils/api";

const API_URL_CHECKOUT = "/api/sale-pos";
const API_URL_PRODUCT_DETAIL_WITH_STATUS_TRUE =
  "/api/product-details/statustrue";
const API_URL_CUSTOMERS = "/api/customers";
const API_URL_VOUCHERS = "/api/vouchers";
const API_Barcode = "/api/barcode/barcode";

const paymentMethodMapping = {
  cash: 0,
  bank_transfer: 1,
};

const SalePOS = {
  getProductDetails: async (filters) => {
    console.log("📌 Lấy danh sách sản phẩm với bộ lọc:", filters);
    try {
      const response = await api.get(API_URL_PRODUCT_DETAIL_WITH_STATUS_TRUE, {
        params: filters,
      });
      console.log("✅ Danh sách sản phẩm:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy sản phẩm:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getCustomers: async (filters) => {
    console.log("📌 Lấy danh sách khách hàng với bộ lọc:", filters);
    try {
      const response = await api.get(API_URL_CUSTOMERS, { params: filters });
      console.log("✅ Dữ liệu khách hàng:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy khách hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createOrder: async (orderData) => {
    console.log("📌 Tạo đơn hàng:", orderData);
    try {
      // Thiết lập customerId mặc định là null để server xử lý khách vãng lai
      const modifiedOrderData = {
        ...orderData,
        customerId: orderData.customerId && orderData.customerId !== -1 ? orderData.customerId : null,
        paymentMethod: paymentMethodMapping[orderData.paymentMethod] ?? 0
      };

      console.log(
        "🔍 Dữ liệu thực sự gửi đi:",
        JSON.stringify(modifiedOrderData, null, 2)
      );

      const response = await api.post(`${API_URL_CHECKOUT}/orders`, modifiedOrderData);
      console.log("✅ Đơn hàng tạo thành công:", response.data);

      if (!response.data || !response.data.data || !response.data.data.id) {
        throw new Error("Không thể tạo đơn hàng!");
      }

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },


  addProductToCart: async (orderId, productData) => {
    console.log(`📌 Thêm sản phẩm vào đơn hàng ${orderId}: `, productData);
    try {
      const response = await api.post(
        `${API_URL_CHECKOUT}/orders/${orderId}/products`,
        productData
      );
      console.log("✅ Sản phẩm đã thêm vào đơn hàng:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi thêm sản phẩm vào đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  completePayment: async (orderId, paymentData) => {
    console.log(`📌 Hoàn tất thanh toán cho đơn hàng #${orderId}`);
    try {
      const response = await api.put(
        `${API_URL_CHECKOUT}/orders/${orderId}/payment`,
        paymentData
      );
      console.log("✅ Thanh toán hoàn tất:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi hoàn tất thanh toán:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getVouchers: async () => {
    console.log("📌 Lấy danh sách voucher hợp lệ");
    try {
      const response = await api.get(API_URL_VOUCHERS);
      console.log("✅ Danh sách voucher hợp lệ:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách voucher:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateOrderInfo: async (orderId, updateData) => {
    console.log(`📌 Cập nhật thông tin đơn hàng #${orderId}:`, updateData);
    try {
      const response = await api.post(`${API_URL_CHECKOUT}/checkout`, {
        orderId: orderId,
        customerId: updateData.customerId,
        voucherId: updateData.voucherId,
      });
      console.log("✅ Cập nhật thông tin đơn hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật thông tin đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  checkout: async (orderData) => {
    console.log("📌 Bắt đầu luồng thanh toán với đơn hàng:", orderData);
    try {
      let orderId = orderData.orderId ?? null;
      if (!orderId) {
        console.log("📌 Không có orderId, tiến hành tạo đơn hàng mới.");
        const orderResponse = await SalePOS.createOrder(orderData);
        orderId = orderResponse.id;
      } else {
        console.log("✅ Sử dụng orderId đã có:", orderId);
      }
      const existingOrder = await SalePOS.getOrderDetails(orderId);
      const existingProducts = existingOrder.orderDetails || [];
      const productsToAdd = [];
      if (orderData.orderDetails && orderData.orderDetails.length > 0) {
        for (let item of orderData.orderDetails) {
          const existingItem = existingProducts.find(
            (existing) => existing.productDetail.id === item.productDetailId
          );
          if (!existingItem) {
            productsToAdd.push(item);
          }
        }
      }
      if (productsToAdd.length > 0) {
        for (let item of productsToAdd) {
          await SalePOS.addProductToCart(orderId, item);
        }
        console.log("✅ Đã thêm các sản phẩm mới vào đơn hàng:", productsToAdd);
      }
      const paymentData = {
        customerId: orderData.customerId,
        voucherId: orderData.voucherId,
      };
      await SalePOS.updateOrderInfo(orderId, paymentData);
      console.log("✅ Đã cập nhật customerId và voucherId");
      console.log("🔍 Xử lý thanh toán cho đơn hàng:", orderId);
      const paymentResponse = await SalePOS.completePayment(
        orderId,
        paymentData
      );
      console.log("✅ Thanh toán thành công:", paymentResponse);
      return { orderId, paymentResponse };
    } catch (error) {
      console.error(
        "❌ Lỗi khi checkout:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getProductByBarcode: async (barcode) => {
    console.log("📌 Lấy sản phẩm theo mã vạch:", barcode);
    try {
      const response = await api.get(API_Barcode);
      console.log("✅ Sản phẩm từ mã vạch:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy sản phẩm theo mã vạch:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getOrderDetails: async (orderId) => {
    console.log(`📌 Lấy chi tiết đơn hàng #${orderId}`);
    try {
      const response = await api.get(`${API_URL_CHECKOUT}/orders/${orderId}`);
      console.log("✅ Chi tiết đơn hàng:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy chi tiết đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    console.log(`📌 Hủy đơn hàng #${orderId}`);
    try {
      const response = await api.put(
        `${API_URL_CHECKOUT}/orders/${orderId}/cancel`
      );
      console.log("✅ Hủy đơn hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi hủy đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePaymentMethod: async (orderId, paymentMethod) => {
    console.log(
      `📌 Cập nhật phương thức thanh toán cho đơn hàng #${orderId}:`,
      paymentMethod
    );
    try {
      const response = await api.put(
        `${API_URL_CHECKOUT}/orders/${orderId}/payment-method`,
        { paymentMethod: paymentMethodMapping[paymentMethod] ?? 0 }
      );
      console.log(
        "✅ Cập nhật phương thức thanh toán thành công:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật phương thức thanh toán:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default SalePOS;
