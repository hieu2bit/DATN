import axios from "axios";

const GHN_API_BASE_URL = "https://online-gateway.ghn.vn";
const GHN_API_TOKEN = "7bb9af15-8fb6-11ef-a205-de063ca823db";
const SHOP_ID = "5404381";

const GHNService = {
  // Lấy danh sách tỉnh/thành
  getProvinces: async () => {
    try {
      const response = await axios.get(
        `${GHN_API_BASE_URL}/shiip/public-api/master-data/province`,
        {
          headers: {
            Token: GHN_API_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Raw Provinces response:", response); // Log toàn bộ phản hồi
      console.log("Provinces data:", response.data);
      if (!response.data || !response.data.data) {
        console.warn(
          "Dữ liệu tỉnh/thành không hợp lệ hoặc trống:",
          response.data
        );
        return { data: [] }; // Trả về mảng rỗng nếu dữ liệu không hợp lệ
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? `Lỗi API GHN: ${error.response.data.message || error.response.status}`
        : `Lỗi mạng: ${error.message}`;
      console.error("Error fetching provinces:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Lấy danh sách quận/huyện theo tỉnh
  getDistrictsByProvince: async (provinceId) => {
    try {
      const response = await axios.post(
        `${GHN_API_BASE_URL}/shiip/public-api/master-data/district`,
        { province_id: Number(provinceId) },
        {
          headers: {
            Token: GHN_API_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "Districts response for provinceId",
        provinceId,
        ":",
        response.data
      );
      return response.data || { data: [] }; // Đảm bảo trả về mảng rỗng nếu dữ liệu không tồn tại
    } catch (error) {
      const errorMessage = error.response
        ? `Lỗi API GHN: ${error.response.data.message || error.response.status}`
        : `Lỗi mạng: ${error.message}`;
      console.error("Error fetching districts:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Lấy danh sách phường/xã theo quận/huyện
  getWardsByDistrict: async (districtId) => {
    try {
      const response = await axios.post(
        `${GHN_API_BASE_URL}/shiip/public-api/master-data/ward`,
        { district_id: Number(districtId) },
        {
          headers: {
            Token: GHN_API_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data || { data: [] }; // Đảm bảo trả về dữ liệu mặc định
    } catch (error) {
      const errorMessage = error.response
        ? `Lỗi API GHN: ${error.response.data.message || error.response.status}`
        : `Lỗi mạng: ${error.message}`;
      console.error("Error fetching wards:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  calculateShippingFee: async ({
    toDistrictId,
    toWardCode,
    weight,
    items,
    serviceTypeId = 2,
  }) => {
    try {
      const response = await axios.post(
        `${GHN_API_BASE_URL}/shiip/public-api/v2/shipping-order/fee`,
        {
          service_type_id: serviceTypeId,
          to_district_id: toDistrictId,
          to_ward_code: toWardCode,
          weight: weight,
          items: items,
        },
        {
          headers: {
            Token: GHN_API_TOKEN,
            ShopId: SHOP_ID,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shipping fee response:", response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? `Lỗi API GHN: ${error.response.data.message || error.response.status}`
        : `Lỗi mạng: ${error.message}`;
      console.error("Error calculating shipping fee:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export default GHNService;
