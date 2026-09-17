package com.desktodate.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {

}