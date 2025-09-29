import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatisticsService from "../../../services/StatisticsService";
import { Card, CardContent } from "./components/card";
import DailyRevenueChart from "./components/DailyRevenueChart";
import WeeklyRevenueChart from "./components/WeeklyRevenueChart";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";
import YearlyRevenueChart from "./components/YearlyRevenueChart";
import ChannelRevenueChart from "./components/ChannelRevenueChart";
import OrderStatusDistributionChart from "./components/OrderStatusDistributionChart";
// import PaymentMethodDistributionChart from "./components/PaymentMethodDistributionChart";
import TopCustomersChart from "./components/TopCustomersChart";
import TopInventoryProductsChart from "./components/TopInventoryProductsChart";

const StatisticsPage = () => {
  const { role } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("daily");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [error, setError] = useState(null);

  // Kiểm tra vai trò ngay khi component được render
  if (role !== "ADMIN") {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-bold">
          Vui lòng đăng nhập dưới quyền ADMIN
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          totalRevenueRes,
          totalProfitRes,
          totalCustomersRes,
          totalInvoicesRes,
          totalAdminsRes,
          totalStaffRes,
          topSellingProducts,
        ] = await Promise.all([
          StatisticsService.getTotalRevenue(),
          StatisticsService.getTotalProfit(),
          StatisticsService.getTotalCustomers(),
          StatisticsService.getTotalInvoices(),
          StatisticsService.getTotalAdmins(),
          StatisticsService.getTotalStaff(),
          StatisticsService.getTopSellingProducts(),
        ]);

        setTotalRevenue(totalRevenueRes || 0);
        setTotalProfit(totalProfitRes || 0);
        setTotalCustomers(totalCustomersRes || 0);
        setTotalInvoices(totalInvoicesRes || 0);
        setTotalAdmins(totalAdminsRes || 0);
        setTotalStaff(totalStaffRes || 0);
        setTopSellingProducts(topSellingProducts || []);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
      }
    };
    fetchAll();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng doanh thu</h2>
          <p className="text-2xl">{totalRevenue.toLocaleString("vi-VN")} đ</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng lợi nhận</h2>
          <p className="text-2xl">{totalProfit.toLocaleString("vi-VN")} đ</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng hóa đơn</h2>
          <p className="text-2xl">{totalInvoices}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng quản trị viên</h2>
          <p className="text-2xl">{totalAdmins}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng nhân viên</h2>
          <p className="text-2xl">{totalStaff}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng khách hàng</h2>
          <p className="text-2xl">{totalCustomers}</p>
        </CardContent>
      </Card>

      {/* Biểu đồ doanh thu với Tabs */}
      <Card className="col-span-3">
        <CardContent>
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "daily" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("daily")}
            >
              Theo Ngày
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "weekly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("weekly")}
            >
              Theo Tuần
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "monthly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("monthly")}
            >
              Theo Tháng
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "yearly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("yearly")}
            >
              Theo Năm
            </button>
          </div>

          {/* Hiển thị biểu đồ theo tab được chọn */}
          {activeTab === "daily" && <DailyRevenueChart />}
          {activeTab === "weekly" && <WeeklyRevenueChart />}
          {activeTab === "monthly" && <MonthlyRevenueChart />}
          {activeTab === "yearly" && <YearlyRevenueChart />}
        </CardContent>
      </Card>
      {/* Doanh thu theo kênh */}
      <ChannelRevenueChart />

      {/* Tỷ lệ đơn hàng theo trạng thái */}
      <OrderStatusDistributionChart />

      {/* Tỷ lệ thanh toán theo phương thức
            <PaymentMethodDistributionChart /> */}

      {/* Top 10 khách hàng mua nhiều nhất */}
      <TopCustomersChart />

      {/* Top 10 sản phẩm tồn kho nhiều nhất */}
      <TopInventoryProductsChart />

      {/* Bộ lọc ngày và top sản phẩm bán chạy */}
      <Card className="col-span-3">
        <CardContent>
          <h2 className="text-xl font-bold">Top 5 sản phẩm bán chạy</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Sản phẩm</th>
                <th className="border p-2">Số lượng bán</th>
                <th className="border p-2">Doanh thu</th>
                <th className="border p-2">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      {product.productDetailName || "Không xác định"}
                    </td>
                    <td className="border p-2 text-center">
                      {product.totalQuantitySold || 0}
                    </td>
                    <td className="border p-2 text-right">
                      {(product.totalRevenue || 0).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="border p-2 text-right">
                      {(product.totalProfit || 0).toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
