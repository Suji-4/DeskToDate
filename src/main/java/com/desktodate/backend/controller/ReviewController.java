package com.desktodate.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desktodate.backend.model.Review;
import com.desktodate.backend.service.ReviewService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.68.128:5173"
})
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/reviews")
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/reviews")
    public List<Review> getReviewsByProduct(
            @RequestParam String productId) {

        return reviewService.getReviewsByProduct(productId);
    }

    @GetMapping("/reviews/rating")
    public double getAverageRating(
            @RequestParam String productId) {

        return reviewService.getAverageRating(productId);
    }
}