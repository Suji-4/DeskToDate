package com.desktodate.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.desktodate.backend.model.Product;
import com.desktodate.backend.service.FileStorageService;
import com.desktodate.backend.service.ProductService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.68.128:5173"
})
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    public ProductController(
            ProductService productService,
            FileStorageService fileStorageService) {

        this.productService = productService;
        this.fileStorageService = fileStorageService;
    }

    // =====================================================
    // ADD PRODUCT
    // =====================================================

    @PostMapping(
            value = "/products",
            consumes = "multipart/form-data"
    )
    public Product addProduct(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String subcategory,
            @RequestParam double price,
            @RequestParam double discount,
            @RequestParam String description,
            @RequestParam int stock,
            @RequestParam("images") List<MultipartFile> images)
            throws IOException {

        Product product = new Product();

        product.setName(name);
        product.setCategory(category);
        product.setSubcategory(subcategory);
        product.setPrice(price);
        product.setDiscount(discount);
        product.setDescription(description);
        product.setStock(stock);

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

        product.setImages(imageUrls);

        // First image is the main image
        if (!imageUrls.isEmpty()) {

            product.setImageUrl(
                    imageUrls.get(0)
            );
        }

        return productService.addProduct(product);
    }

    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    @GetMapping("/products/{id}")
    public Product getProductById(
            @PathVariable String id) {

        return productService.getProductById(id);
    }

    // =====================================================
    // GET PRODUCTS BY CATEGORY
    // =====================================================

    @GetMapping("/products/category/{category}")
    public List<Product> getProductsByCategory(
            @PathVariable String category) {

        return productService.getProductsByCategory(
                category
        );
    }

    // =====================================================
    // GET PRODUCTS BY SUBCATEGORY
    // =====================================================

    @GetMapping("/products/subcategory/{subcategory}")
    public List<Product> getProductsBySubcategory(
            @PathVariable String subcategory) {

        return productService.getProductsBySubcategory(
                subcategory
        );
    }

    // =====================================================
    // GET BY CATEGORY + SUBCATEGORY
    // =====================================================

    @GetMapping(
            "/products/category/{category}/subcategory/{subcategory}"
    )
    public List<Product> getProductsByCategoryAndSubcategory(
            @PathVariable String category,
            @PathVariable String subcategory) {

        return productService
                .getProductsByCategoryAndSubcategory(
                        category,
                        subcategory
                );
    }

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    @PutMapping(
            value = "/products/{id}",
            consumes = "multipart/form-data"
    )
    public Product updateProduct(
            @PathVariable String id,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String subcategory,
            @RequestParam double price,
            @RequestParam double discount,
            @RequestParam String description,
            @RequestParam int stock,
            @RequestParam(
                    value = "images",
                    required = false
            )
            List<MultipartFile> images)
            throws IOException {

        return productService.updateProduct(
                id,
                name,
                category,
                subcategory,
                price,
                discount,
                description,
                stock,
                images
        );
    }

    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    @DeleteMapping("/products/{id}")
    public String deleteProduct(
            @PathVariable String id)
            throws IOException {

        productService.deleteProduct(id);

        return "product deleted successfully";
    }
}