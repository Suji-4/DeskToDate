package com.desktodate.backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.desktodate.backend.model.Product;
import com.desktodate.backend.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    public ProductService(
            ProductRepository productRepository,
            FileStorageService fileStorageService) {

        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getProductsBySubcategory(String subcategory) {
        return productRepository.findBySubcategory(subcategory);
    }

    public List<Product> getProductsByCategoryAndSubcategory(
            String category,
            String subcategory) {

        return productRepository
                .findByCategoryAndSubcategory(
                        category,
                        subcategory
                );
    }

    public Product updateProduct(
            String id,
            String name,
            String category,
            String subcategory,
            double price,
            double discount,
            String description,
            int stock,
            List<MultipartFile> images)
            throws IOException {

        Product existingProduct =
                productRepository.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(name);
        existingProduct.setCategory(category);
        existingProduct.setSubcategory(subcategory);
        existingProduct.setPrice(price);
        existingProduct.setDiscount(discount);
        existingProduct.setDescription(description);
        existingProduct.setStock(stock);

        if (images != null && !images.isEmpty()) {

            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile image : images) {

                if (image != null && !image.isEmpty()) {

                    String imageUrl =
                            fileStorageService.saveImage(image);

                    imageUrls.add(imageUrl);
                }
            }

            if (!imageUrls.isEmpty()) {

                // Delete old images
                if (existingProduct.getImages() != null) {

                    for (String oldImage :
                            existingProduct.getImages()) {

                        fileStorageService.deleteImage(
                                oldImage
                        );
                    }
                }

                // First image becomes main image
                existingProduct.setImageUrl(
                        imageUrls.get(0)
                );

                existingProduct.setImages(
                        imageUrls
                );
            }
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(String id)
            throws IOException {

        Product product =
                productRepository.findById(id).orElse(null);

        if (product == null) {
            return;
        }

        // Delete all product images
        if (product.getImages() != null) {

            for (String image :
                    product.getImages()) {

                fileStorageService.deleteImage(
                        image
                );
            }

        } else if (product.getImageUrl() != null) {

            // Support old products
            fileStorageService.deleteImage(
                    product.getImageUrl()
            );
        }

        productRepository.deleteById(id);
    }
}