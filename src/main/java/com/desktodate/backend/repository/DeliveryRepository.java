package com.desktodate.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Delivery;

public interface DeliveryRepository
        extends MongoRepository<Delivery, String> {

    Optional<Delivery> findByUserId(String userId);
}