package com.desktodate.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.CartItem;
import com.desktodate.backend.model.Delivery;
import com.desktodate.backend.model.Order;
import com.desktodate.backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order placeOrder(
            String userId,
            List<CartItem> items,
            Delivery delivery,
            String paymentMethod,
            double subtotal,
            double shipping,
            double tax,
            double total) {

        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException(
                    "User ID is required");
        }

        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException(
                    "Order must contain at least one product");
        }

        if (delivery == null) {
            throw new IllegalArgumentException(
                    "Delivery information is required");
        }

        if (paymentMethod == null
                || paymentMethod.isBlank()) {

            throw new IllegalArgumentException(
                    "Payment method is required");
        }

        if (!paymentMethod.equals("cod")) {
            throw new IllegalArgumentException(
                    "Only Cash on Delivery is available");
        }

        Order order = new Order();

        order.setOrderNumber(
                "D2D-" + System.currentTimeMillis());

        order.setUserId(userId);

        order.setItems(
                new ArrayList<>(items));

        order.setDelivery(delivery);

        order.setPaymentMethod(paymentMethod);

        order.setSubtotal(subtotal);

        order.setShipping(shipping);

        order.setTax(tax);

        order.setTotal(total);

        order.setOrderDate(
                LocalDateTime.now());

        order.setStatus("PLACED");

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(
            String userId) {

        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(String id) {

        return orderRepository
                .findById(id)
                .orElse(null);
    }
}