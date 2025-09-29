package backend.datn.helpers.repositories;

import backend.datn.dto.response.statistic.ProductDetailDTO;
import backend.datn.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<ProductDetail, Integer> {

    // Doanh thu theo ngày
    @Query(value = """
            SELECT
                 DAY(o.create_date) AS dayNumber,
                 MONTH(o.create_date) AS monthNumber,
                 YEAR(o.create_date) AS yearNumber,
                 IFNULL(SUM(o.total_bill), 0) AS dailyRevenue
            FROM `order` o
            WHERE o.status_order = 5
            GROUP BY YEAR(o.create_date), MONTH(o.create_date), DAY(o.create_date)
            ORDER BY yearNumber, monthNumber, dayNumber;
            """, nativeQuery = true)
    List<Object[]> getDailyRevenue();

    // Doanh thu theo tuần
    @Query(value = """
            SELECT
                WEEK(o.create_date, 1) AS weekNumber,
                YEAR(o.create_date) AS yearNumber,
                IFNULL(SUM(o.total_bill), 0) AS weeklyRevenue
            FROM `order` o
            WHERE o.status_order = 5
            GROUP BY WEEK(o.create_date, 1), YEAR(o.create_date)
            ORDER BY yearNumber DESC, weekNumber DESC;
            """, nativeQuery = true)
    List<Object[]> getWeeklyRevenue();

    // Doanh thu theo tháng
    @Query(value = """
            SELECT
                MONTH(o.create_date) AS monthNumber,
                YEAR(o.create_date) AS yearNumber,
                IFNULL(SUM(o.total_bill), 0) AS monthlyRevenue
            FROM `order` o
            WHERE o.status_order = 5
            GROUP BY MONTH(o.create_date), YEAR(o.create_date)
            ORDER BY yearNumber DESC, monthNumber DESC;
            """, nativeQuery = true)
    List<Object[]> getMonthlyRevenue();

    // Doanh thu theo năm
    @Query(value = """
            SELECT
                YEAR(o.create_date) AS year,
                IFNULL(SUM(o.total_bill), 0) AS yearlyRevenue
            FROM `order` o
            WHERE o.status_order = 5
            GROUP BY YEAR(o.create_date)
            ORDER BY YEAR(o.create_date) DESC;
            """, nativeQuery = true)
    List<Object[]> getYearlyRevenue();

    // Top 5 sản phẩm bán chạy nhất kèm lợi nhuận
    @Query(value = """
            SELECT
                CONCAT(p.product_name, ' ', c.color_name, ' ', s.size_name) AS productDetailName,
                SUM(od.quantity) AS totalQuantitySold,
                SUM(od.quantity * pd.sale_price) AS totalRevenue,
                (SUM(od.quantity * pd.sale_price) - SUM(od.quantity * pd.import_price)) AS productProfit
            FROM product p
            JOIN product_detail pd ON pd.product_id = p.id
            JOIN size s ON pd.size_id = s.id
            JOIN color c ON c.id = pd.color_id
            JOIN order_detail od ON od.product_detail_id = pd.id
            JOIN `order` o ON o.id = od.order_id
            WHERE o.status_order = 5
            GROUP BY p.product_name, c.color_name, s.size_name
            ORDER BY totalQuantitySold DESC, totalRevenue DESC
            LIMIT 5
            """, nativeQuery = true)
    List<Object[]> getTop5BestSellingProductDetail();

    // Tổng doanh thu
    @Query(value = """
            SELECT IFNULL(SUM(total_bill), 0)
            FROM `order`
            WHERE status_order = 5
            """, nativeQuery = true)
    BigDecimal getTotalRevenue();

    // Tổng lợi nhuận
    @Query(value = """
            SELECT
                (SELECT IFNULL(SUM(o.total_bill), 0)
                 FROM `order` o
                 WHERE o.status_order = 5)
                -
                (SELECT IFNULL(SUM(od.quantity * pd.import_price), 0)
                 FROM order_detail od
                 JOIN product_detail pd ON od.product_detail_id = pd.id
                 JOIN `order` o ON o.id = od.order_id
                 WHERE o.status_order = 5) AS total_profit;
                """, nativeQuery = true)
    BigDecimal getTotalProfit();

    // Tổng số lượng khách hàng
    @Query(value = "SELECT COUNT(id) FROM customer", nativeQuery = true)
    Integer getNumberOfCustomers();

    // Tổng số hóa đơn
    @Query(value = "SELECT COUNT(id) FROM `order`", nativeQuery = true)
    Integer getNumberOfInvoices();

    // Tổng số admin
    @Query(value = "SELECT COUNT(id) FROM employee WHERE role_id = 1", nativeQuery = true)
    Integer getNumberOfAdmin();

    // Tổng số staff
    @Query(value = "SELECT COUNT(id) FROM employee WHERE role_id = 2", nativeQuery = true)
    Integer getNumberOfStaff();

    // Doanh thu theo kênh
    @Query(value = """
            SELECT
                DAY(o.create_date) AS dayNumber,
                MONTH(o.create_date) AS monthNumber,
                YEAR(o.create_date) AS yearNumber,
                SUM(CASE WHEN o.kind_of_order = 0 THEN o.total_bill ELSE 0 END) AS onlineRevenue,
                SUM(CASE WHEN o.kind_of_order = 1 THEN o.total_bill ELSE 0 END) AS inStoreRevenue
            FROM `order` o
            WHERE o.status_order = 5
            GROUP BY YEAR(o.create_date), MONTH(o.create_date), DAY(o.create_date)
            ORDER BY yearNumber, monthNumber, dayNumber;
            """, nativeQuery = true)
    List<Object[]> getChannelRevenue();

    // Phân bố trạng thái đơn hàng
    @Query(value = """
            SELECT
                o.status_order AS statusOrder,
                CASE
                    WHEN o.status_order = -1 THEN 'Đã hủy'
                    WHEN o.status_order = 0 THEN 'Chờ xác nhận'
                    WHEN o.status_order = 1 THEN 'Chờ thanh toán'
                    WHEN o.status_order = 2 THEN 'Đã xác nhận'
                    WHEN o.status_order = 3 THEN 'Đang giao hàng'
                    WHEN o.status_order = 4 THEN 'Giao hàng không thành công'
                    WHEN o.status_order = 5 THEN 'Hoàn thành'
                    ELSE 'Không xác định'
                END AS statusName,
                COUNT(o.id) AS orderCount
            FROM `order` o
            GROUP BY o.status_order
            ORDER BY o.status_order;
            """, nativeQuery = true)
    List<Object[]> getOrderStatusDistribution();

    // Phân bố phương thức thanh toán
    @Query(value = """
            SELECT
                o.payment_method AS paymentMethod,
                CASE
                    WHEN o.payment_method = 0 THEN 'Tiền mặt'
                    WHEN o.payment_method = 1 THEN 'VNPay'
                    ELSE 'Không xác định'
                END AS methodName,
                COUNT(o.id) AS orderCount
            FROM `order` o
            WHERE o.status_order = 5
            GROUP BY o.payment_method;
            """, nativeQuery = true)
    List<Object[]> getPaymentMethodDistribution();

    // Top 10 khách hàng
    @Query(value = """
            SELECT
                IFNULL(c.fullname, 'Khách hàng không xác định') AS customerName,
                COUNT(o.id) AS totalOrders,
                IFNULL(SUM(o.total_bill), 0) AS totalSpent
            FROM `order` o
            LEFT JOIN customer c ON c.id = o.customer_id
            WHERE o.status_order = 5
            GROUP BY c.fullname
            ORDER BY totalSpent DESC
            LIMIT 10;
            """, nativeQuery = true)
    List<Object[]> getTop10Customers();

    // Top 10 sản phẩm tồn kho nhiều nhất
    @Query(value = """
            SELECT
                CONCAT(p.product_name, ' ', c.color_name, ' ', s.size_name) AS productDetailName,
                pd.quantity AS quantity
            FROM product_detail pd
            JOIN product p ON p.id = pd.product_id
            JOIN color c ON c.id = pd.color_id
            JOIN size s ON s.id = pd.size_id
            WHERE pd.status = 1
            ORDER BY pd.quantity DESC
            LIMIT 10;
            """, nativeQuery = true)
    List<Object[]> getTop10InventoryProducts();
}
