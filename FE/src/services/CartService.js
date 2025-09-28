import api from "../ultils/api";

const CartService = {
  async getAllCartItems() {
    try {
      const response = await api.get(`/cart`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  },

  async addProductToCart(cartItemRequest) {
    try {
      const response = await api.post(`/cart`, cartItemRequest);
      return response.data.data;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
    }
  },

  async removeProductFromCart(cartItemId) {
    try {
      const response = await api.delete(`/cart/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing product from cart:", error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const response = await api.delete(`/cart`);
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  async updateCartItemQuantity(cartItemId, quantity) {
    try {
      const response = await api.put(`/cart/${cartItemId}`, null, {
        params: { quantity },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  },
};

export default CartService;
