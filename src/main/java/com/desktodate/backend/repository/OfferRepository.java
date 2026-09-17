package com.desktodate.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Offer;

public interface OfferRepository extends MongoRepository<Offer, String> {

    List<Offer> findByActiveTrue();

    List<Offer> findByTypeAndActiveTrue(String type);
}