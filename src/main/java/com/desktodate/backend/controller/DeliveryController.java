package com.desktodate.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.desktodate.backend.model.Delivery;
import com.desktodate.backend.service.DeliveryService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.68.128:5173"
})
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(
            DeliveryService deliveryService) {

        this.deliveryService = deliveryService;
    }

    @PostMapping("/delivery/{userId}")
    public Delivery saveDelivery(
            @PathVariable String userId,
            @RequestBody Delivery delivery) {

        return deliveryService.saveDelivery(
                userId,
                delivery);
    }

    @GetMapping("/delivery/{userId}")
    public Delivery getDelivery(
            @PathVariable String userId) {

        return deliveryService.getDelivery(userId);
    }
}