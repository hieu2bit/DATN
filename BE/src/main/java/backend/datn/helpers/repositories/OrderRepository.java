package backend.datn.helpers.repositories;


import backend.datn.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("""
                SELECT o FROM Order o 
                WHERE (:search IS NULL OR :search = '' OR LOWER(o.orderCode) LIKE LOWER('%' || :search || '%'))
            """)
    Page<Order> searchOrder(@Param("search") String search, Pageable pageable);


    // Tìm đơn hàng theo mã
    Optional<Order> findByOrderCode(String orderCode); // Đảm bảo trả về Optional


    // Tìm đơn hàng theo trạng thái
    List<Order> findByStatusOrder(int statusOrder);

    // Tìm đơn hàng theo khách hàng
    List<Order> findByCustomerId(int customerId);


    // Tìm các đơn hàng chưa thanh toán (chuyển khoản ngân hàng và ví điện tử) quá hạn
    @Query("""
                SELECT o FROM Order o 
                WHERE o.statusOrder = 1 
                  AND ((o.paymentMethod = 1 AND o.createDate < :bankTransferDeadline) 
                    OR (o.paymentMethod = 2 AND o.createDate < :eWalletDeadline))
            """)
    List<Order> findUnpaidOrders(
            @Param("bankTransferDeadline") Instant bankTransferDeadline,
            @Param("eWalletDeadline") Instant eWalletDeadline
    );

}

