package backend.datn.helpers.repositories;

import backend.datn.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderOnlineDetailRepository extends JpaRepository<OrderOnlineDetail, Integer> {
    List<OrderOnlineDetail> findByOrder(OrderOnline order);



}