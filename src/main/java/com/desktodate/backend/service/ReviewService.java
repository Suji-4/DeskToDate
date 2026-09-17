package com.desktodate.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Review;
import com.desktodate.backend.repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review addReview(Review review) {

        if (review.getProductId() == null || review.getProductId().isBlank()) {
            throw new IllegalArgumentException("Product ID is required");
        }

        if (review.getName() == null || review.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (review.getComment() == null || review.getComment().isBlank()) {
            throw new IllegalArgumentException("Comment is required");
        }

        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        review.setName(review.getName().trim());
        review.setComment(review.getComment().trim());

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProduct(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    public double getAverageRating(String productId) {

        List<Review> reviews =
                reviewRepository.findByProductId(productId);

        if (reviews.isEmpty()) {
            return 0.0;
        }

        double total = 0;

        for (Review review : reviews) {
            total += review.getRating();
        }

        return Math.round((total / reviews.size()) * 10.0) / 10.0;
    }
}