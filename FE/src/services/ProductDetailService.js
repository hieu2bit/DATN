import api from "../ultils/api"; // Sử dụng api từ api.js

const ProductDetailService = {
  async createProductDetail(productDetailData) {
    try {
      const response = await api.post(
        `/api/product-details`,
        productDetailData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating product detail:", error);
      throw error;
    }
  },

  async generateProductDetails(generateModel) {
    try {
      const response = await api.post(
        `/api/product-details/generate`,
        generateModel,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error generating product details:", error);
      throw error;
    }
  },

  async getAllProductDetails(params) {
    try {
      // Chuyển đổi các danh sách (array) thành dạng query params đúng
      const formattedParams = {
        ...params,
        collarIds: params.collarIds ? params.collarIds.join(",") : undefined,
        colorIds: params.colorIds ? params.colorIds.join(",") : undefined,
        sizeIds: params.sizeIds ? params.sizeIds.join(",") : undefined,
        sleeveIds: params.sleeveIds ? params.sleeveIds.join(",") : undefined,
      };

      const response = await api.get(`/api/product-details`, {
        params: formattedParams,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  async getProductDetailById(id) {
    try {
      const response = await api.get(`/api/product-details/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product detail by ID:", error);
      throw error;
    }
  },

  async updateProductDetail(id, updateData) {
    try {
      const response = await api.put(`/api/product-details/${id}`, updateData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating product detail:", error);
      throw error;
    }
  },

  async toggleProductDetailStatus(id) {
    try {
      const response = await api.patch(
        `/api/product-details/${id}/toggle-status`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error toggling product detail status:", error);
      throw error;
    }
  },

  async getProductVariants(productCode) {
    try {
      const response = await api.get(
        `/api/v1/product-details/${productCode}/variants`
      );
      return response.data.data || []; // Trả về mảng rỗng nếu response.data là null
    } catch (error) {
      console.error("Error fetching product variants:", error);
      throw error;
    }
  },
};

export default ProductDetailService;
