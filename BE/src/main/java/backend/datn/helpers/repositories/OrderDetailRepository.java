package backend.datn.helpers.repositories;

import backend.datn.entities.Order;
import backend.datn.entities.OrderDetail;
import backend.datn.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    @Query("SELECT od FROM OrderDetail od WHERE od.order.id = :orderId")
    List<OrderDetail> findByOrderId(@Param("orderId") int orderId);

    // Lấy danh sách chi tiết đơn hàng theo sản phẩm
    List<OrderDetail> findByProductDetailId(int productDetailId);

    Optional<OrderDetail> findByOrderAndProductDetail(Order order, ProductDetail productDetail);
}