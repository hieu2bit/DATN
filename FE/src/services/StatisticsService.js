import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_BASE_URL = "/api/statistics"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const StatisticsService = {
    // Lấy doanh thu ngày
    getDailyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/daily-revenue`);
            console.log("✅ Doanh thu ngày:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu ngày
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu ngày:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu tuần
    getWeeklyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/weekly-revenue`);
            console.log("✅ Doanh thu tuần:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu tuần
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu tuần:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu tháng
    getMonthlyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/monthly-revenue`);
            console.log("✅ Doanh thu tháng:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu tháng
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu tháng:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu năm
    getYearlyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/yearly-revenue`);
            console.log("✅ Doanh thu năm:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu năm
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu năm:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu theo kênh (online vs tại quầy)
    getChannelRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/channel-revenue`);
            console.log("✅ Doanh thu theo kênh:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu theo kênh
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu theo kênh:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tỷ lệ đơn hàng theo trạng thái
    getOrderStatusDistribution: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/order-status-distribution`);
            console.log("✅ Tỷ lệ đơn hàng theo trạng thái:", response.data.data);
            return response.data.data; // Trả về dữ liệu tỷ lệ đơn hàng
        } catch (error) {
            console.error("❌ Lỗi khi lấy tỷ lệ đơn hàng theo trạng thái:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tỷ lệ thanh toán theo phương thức
    getPaymentMethodDistribution: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/payment-method-distribution`);
            console.log("✅ Tỷ lệ thanh toán theo phương thức:", response.data.data);
            return response.data.data; // Trả về dữ liệu tỷ lệ thanh toán
        } catch (error) {
            console.error("❌ Lỗi khi lấy tỷ lệ thanh toán theo phương thức:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy top 5 khách hàng mua nhiều nhất
    getTop5Customers: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/top-5-customers`);
            console.log("✅ Top 5 khách hàng:", response.data.data);
            return response.data.data; // Trả về dữ liệu top 5 khách hàng
        } catch (error) {
            console.error("❌ Lỗi khi lấy top 5 khách hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tỷ lệ sử dụng voucher
    getVoucherUsage: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/voucher-usage`);
            console.log("✅ Tỷ lệ sử dụng voucher:", response.data.data);
            return response.data.data; // Trả về dữ liệu tỷ lệ sử dụng voucher
        } catch (error) {
            console.error("❌ Lỗi khi lấy tỷ lệ sử dụng voucher:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy top 5 sản phẩm tồn kho nhiều nhất
    getTop5InventoryProducts: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/top-5-inventory-products`);
            console.log("✅ Top 5 sản phẩm tồn kho:", response.data.data);
            return response.data.data; // Trả về dữ liệu top 5 sản phẩm tồn kho
        } catch (error) {
            console.error("❌ Lỗi khi lấy top 5 sản phẩm tồn kho:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tỷ lệ giỏ hàng bị bỏ quên
    getCartAbandonmentRate: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/cart-abandonment-rate`);
            console.log("✅ Tỷ lệ giỏ hàng bị bỏ quên:", response.data.data);
            return response.data.data; // Trả về dữ liệu tỷ lệ giỏ hàng bị bỏ quên
        } catch (error) {
            console.error("❌ Lỗi khi lấy tỷ lệ giỏ hàng bị bỏ quên:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng doanh thu
    getTotalRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-revenue`);
            console.log("✅ Tổng doanh thu:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng doanh thu
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng doanh thu:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số khách hàng
    getTotalCustomers: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-customers`);
            console.log("✅ Tổng số khách hàng:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số khách hàng
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số khách hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số hóa đơn
    getTotalInvoices: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-invoices`);
            console.log("✅ Tổng số hóa đơn:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số hóa đơn
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số hóa đơn:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số quản trị viên
    getTotalAdmins: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-admins`);
            console.log("✅ Tổng số quản trị viên:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số quản trị viên
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số quản trị viên:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số nhân viên
    getTotalStaff: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-staff`);
            console.log("✅ Tổng số nhân viên:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số nhân viên
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số nhân viên:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy danh sách sản phẩm bán chạy nhất
    getTopSellingProducts: async (startDate, endDate) => {
        try {
            const response = await api.get(`${API_BASE_URL}/top-5-products`, {
                params: { startDate, endDate },
            });
            console.log("✅ Top sản phẩm bán chạy:", response.data.data);
            return response.data.data; // Trả về dữ liệu top sản phẩm
        } catch (error) {
            console.error("❌ Lỗi khi lấy top sản phẩm bán chạy:", error.response?.data || error.message);
            throw error;
        }
    },
};

export default StatisticsService;