package com.desktodate.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.desktodate.backend.model.Category;
import com.desktodate.backend.service.CategoryService;
import com.desktodate.backend.service.FileStorageService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.68.128:5173"
})
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;

    public CategoryController(
            CategoryService categoryService,
            FileStorageService fileStorageService) {

        this.categoryService = categoryService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping(consumes = "multipart/form-data")
    public Category addCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "images", required = false)
            List<MultipartFile> images,
            @RequestParam("subcategories") String subcategories)
            throws IOException {

        List<String> imageUrls = new ArrayList<>();

        if (images != null) {

            for (MultipartFile image : images) {

                if (image != null && !image.isEmpty()) {

                    String imageUrl =
                            fileStorageService.saveImage(image);

                    imageUrls.add(imageUrl);
                }
            }
        }

        List<String> subcategoryList = Arrays.stream(
                subcategories.split(",")
        )
        .map(String::trim)
        .filter(value -> !value.isEmpty())
        .toList();

        return categoryService.addCategory(
                name,
                imageUrls,
                subcategoryList
        );
    }
}