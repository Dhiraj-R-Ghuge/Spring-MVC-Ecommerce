package com.Dhiraj.SpringEcom.model.dto;

import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        String OrderId,
        String customerName,
        String email,
        String status,
        LocalDate oderDate,
        List<OrderItemResponse> items
) {
}
