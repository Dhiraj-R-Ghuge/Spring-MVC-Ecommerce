package com.Dhiraj.SpringEcom.repo;

import com.Dhiraj.SpringEcom.model.Order;
import com.Dhiraj.SpringEcom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepo  extends JpaRepository<Order, Integer> {
    Optional<Order>  findByOrderId(String orderId);
}
