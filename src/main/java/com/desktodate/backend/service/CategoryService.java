package com.desktodate.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Category;
import com.desktodate.backend.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(
            String name,
            List<String> imageUrls,
            List<String> subcategories) {

        Category category = new Category();

        category.setName(name);
        category.setImages(imageUrls);
        category.setSubcategories(subcategories);

        return categoryRepository.save(category);
    }
}