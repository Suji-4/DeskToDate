package com.desktodate.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByProductId(String productId);
}