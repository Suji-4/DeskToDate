package com.desktodate.backend.service;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Delivery;
import com.desktodate.backend.repository.DeliveryRepository;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(
            DeliveryRepository deliveryRepository) {

        this.deliveryRepository = deliveryRepository;
    }

    public Delivery saveDelivery(
            String userId,
            Delivery delivery) {

        Delivery existingDelivery =
                deliveryRepository
                        .findByUserId(userId)
                        .orElse(new Delivery());

        existingDelivery.setUserId(userId);
        existingDelivery.setFullName(
                delivery.getFullName());
        existingDelivery.setEmail(
                delivery.getEmail());
        existingDelivery.setPhone(
                delivery.getPhone());
        existingDelivery.setAddress(
                delivery.getAddress());
        existingDelivery.setCity(
                delivery.getCity());
        existingDelivery.setState(
                delivery.getState());
        existingDelivery.setPincode(
                delivery.getPincode());

        return deliveryRepository.save(
                existingDelivery);
    }

    public Delivery getDelivery(String userId) {

        return deliveryRepository
                .findByUserId(userId)
                .orElse(null);
    }
}