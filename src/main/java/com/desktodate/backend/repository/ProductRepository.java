package com.desktodate.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Product;

public interface ProductRepository
        extends MongoRepository<Product, String> {

    List<Product> findByCategory(String category);

    List<Product> findBySubcategory(String subcategory);

    List<Product> findByCategoryAndSubcategory(
            String category,
            String subcategory
    );
}