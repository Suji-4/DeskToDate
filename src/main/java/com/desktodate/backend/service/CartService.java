package com.desktodate.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Cart;
import com.desktodate.backend.model.CartItem;
import com.desktodate.backend.model.Product;
import com.desktodate.backend.repository.CartRepository;
import com.desktodate.backend.repository.ProductRepository;

@Service
public class CartService {
	
	private final CartRepository cartRepository;
	private final ProductRepository productRepository;
	
	public CartService(
			CartRepository cartRepository,
			ProductRepository productRepository) {
		
		this.cartRepository = cartRepository;
		this.productRepository = productRepository;
	}
	
	public Cart getCart(String userId) {
		return cartRepository.findByUserId(userId)
				.orElseGet(()->{
					
					Cart cart = new Cart();
					
					cart.setUserId(userId);
					cart.setItems(new ArrayList<>());
					
					return cartRepository.save(cart);
				});
	}
	
	public Cart addToCart(String userId, String productId,int quantity) {
		if(userId == null || userId.isBlank()) {
			throw new IllegalArgumentException("User Id is required");
		}
		
		if(productId == null || productId.isBlank()) {
			throw new IllegalArgumentException("Product Id is requried");
		}
		
		if(quantity <=0) {
			throw new IllegalArgumentException("Quantity must be greater than 0");
		}
		
		Product product = productRepository
				.findById(productId)
				.orElseThrow(()->
				new IllegalArgumentException("Product not found"));
		
		if(product.getStock()<=0) {
			throw new IllegalArgumentException("Product is oot of stock");
		}
		
		Cart cart = getCart(userId);
		
		if(cart.getItems()==null) {
			cart.setItems(new ArrayList<>());
		}
		
		CartItem existingItem = cart.getItems()
				.stream()
				.filter(item->
				item.getProductId().equals(productId))
				.findFirst()
				.orElse(null);
		
		if(existingItem != null) {
			int newQuantity = existingItem.getQuantity() + quantity;
			
			if(newQuantity>product.getStock()) {
				throw new IllegalArgumentException(
						"Only" + product.getStock()
						+ "items available in stock");
			}
			
			existingItem.setQuantity(newQuantity);
			
			updateProductInformation(existingItem,product);
		}else {
			if(quantity > product.getStock()) {
				throw new IllegalArgumentException(
						"Only" + product.getStock()
						+ "items available in stock");
			}
			
			CartItem cartItem = createCartItem(product,quantity);
			cart.getItems().add(cartItem);
		}
		return cartRepository.save(cart);
	}
	
	public Cart updateQuantity(
            String userId,
            String productId,
            int quantity) {

        if (quantity <= 0) {
            return removeFromCart(
                    userId,
                    productId);
        }

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found"));

        if (quantity > product.getStock()) {
            throw new IllegalArgumentException(
                    "Only " + product.getStock()
                            + " items available in stock");
        }

        Cart cart = getCart(userId);

        CartItem item = cart.getItems()
                .stream()
                .filter(cartItem ->
                        cartItem.getProductId()
                                .equals(productId))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product is not in cart"));

        item.setQuantity(quantity);

        updateProductInformation(
                item,
                product);

        return cartRepository.save(cart);
    }

    public Cart removeFromCart(
            String userId,
            String productId) {

        Cart cart = getCart(userId);

        List<CartItem> updatedItems =
                cart.getItems()
                        .stream()
                        .filter(item ->
                                !item.getProductId()
                                        .equals(productId))
                        .toList();

        cart.setItems(
                new ArrayList<>(updatedItems));

        return cartRepository.save(cart);
    }

    public Cart clearCart(String userId) {

        Cart cart = getCart(userId);

        cart.setItems(new ArrayList<>());

        return cartRepository.save(cart);
    }

    private CartItem createCartItem(
            Product product,
            int quantity) {

        CartItem item = new CartItem();

        item.setProductId(product.getId());
        item.setName(product.getName());
        item.setCategory(product.getCategory());
        item.setPrice(product.getPrice());
        item.setQuantity(quantity);

        String imageUrl = product.getImageUrl();

        if ((imageUrl == null || imageUrl.isBlank())
                && product.getImages() != null
                && !product.getImages().isEmpty()) {

            imageUrl = product.getImages().get(0);
        }

        item.setImageUrl(imageUrl);

        return item;
    }

    private void updateProductInformation(
            CartItem item,
            Product product) {

        item.setName(product.getName());
        item.setCategory(product.getCategory());
        item.setPrice(product.getPrice());

        String imageUrl = product.getImageUrl();

        if ((imageUrl == null || imageUrl.isBlank())
                && product.getImages() != null
                && !product.getImages().isEmpty()) {

            imageUrl = product.getImages().get(0);
        }

        item.setImageUrl(imageUrl);
    }
	

}
