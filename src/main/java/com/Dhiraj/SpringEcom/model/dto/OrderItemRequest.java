package com.Dhiraj.SpringEcom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {
}
