import api from "../ultils/api"; // Sử dụng api từ api.js

const ProductService = {
  async getAllProducts(
    page = 0,
    size = 100,
    keyword = "",
    status = null,
    sortBy = "id",
    sortDirection = "asc"
  ) {
    try {
      const response = await api.get(`/api/products`, {
        params: {
          page,
          size,
          keyword,
          status,
          sortBy,
          sortDirection,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post(`/api/products`, productData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  async toggleProductStatus(id) {
    try {
      const response = await api.patch(`/api/products/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      console.error("Error toggling product status:", error);
      throw error;
    }
  },

  async getFilteredProducts({
    search = "",
    brandIds = [],
    categoryIds = [],
    materialIds = [],
    collarIds = [],
    sleeveIds = [],
    colorIds = [],
    sizeIds = [],
    minPrice = null,
    maxPrice = null,
    sortBy = "",
    sortDir = "",
    page = 0,
    size = 10,
  }) {
    try {
      const response = await api.get(`/api/products/filter`, {
        params: {
          search,
          brandIds: brandIds.length > 0 ? brandIds.join(",") : null,
          categoryIds: categoryIds.length > 0 ? categoryIds.join(",") : null,
          materialIds: materialIds.length > 0 ? materialIds.join(",") : null,
          collarIds: collarIds.length > 0 ? collarIds.join(",") : null,
          sleeveIds: sleeveIds.length > 0 ? sleeveIds.join(",") : null,
          colorIds: colorIds.length > 0 ? colorIds.join(",") : null,
          sizeIds: sizeIds.length > 0 ? sizeIds.join(",") : null,
          minPrice,
          maxPrice,
          sortBy,
          sortDir,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  },

  async getProductDetailsByProductCode(productCode) {
    try {
      const response = await api.get(
        `/api/v1/product-details/${productCode}/variants`
      );
      console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu
      return response.data;
    } catch (error) {
      console.error("Error fetching product details by product code:", error);
      throw error;
    }
  },
};

export default ProductService;
