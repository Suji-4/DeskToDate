package com.desktodate.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.desktodate.backend.model.Order;
import com.desktodate.backend.service.OrderService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.68.128:5173"
})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public Order placeOrder(
            @RequestBody Order order) {

        return orderService.placeOrder(
                order.getUserId(),
                order.getItems(),
                order.getDelivery(),
                order.getPaymentMethod(),
                order.getSubtotal(),
                order.getShipping(),
                order.getTax(),
                order.getTotal());
    }

    @GetMapping("/orders/user/{userId}")
    public List<Order> getOrdersByUserId(
            @PathVariable String userId) {

        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/orders/{id}")
    public Order getOrderById(
            @PathVariable String id) {

        return orderService.getOrderById(id);
    }
}