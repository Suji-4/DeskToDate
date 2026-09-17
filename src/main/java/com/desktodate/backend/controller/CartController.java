package com.desktodate.backend.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desktodate.backend.model.Cart;
import com.desktodate.backend.service.CartService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.68.128:5173"
})
public class CartController {
	
	private final CartService cartService;
	
	public CartController(CartService cartService) {
		this.cartService = cartService;
	}
	
	@GetMapping("/cart/{userId}")
	public Cart getCart(@PathVariable String userId) {
		return cartService.getCart(userId);
	}
	
	@PostMapping("/cart/{userId}/add")
	public Cart addToCart(
			@PathVariable String userId,
			@RequestParam String productId,
			@RequestParam int quantity) {
		
		return cartService.addToCart(userId, productId, quantity);
		
	}
	
	@PutMapping("/cart/{userId}/update")
	public Cart updateQuantity(
			@PathVariable String userId,
			@RequestParam String productId,
			@RequestParam int quantity) {
		return cartService.updateQuantity(userId, productId, quantity);
	}
	
	@DeleteMapping("/cart/{userId}/remove")
	public Cart removeFromCart(
			@PathVariable String userId,
			@RequestParam String productId) {
		return cartService.removeFromCart(userId, productId);
	}
	
	@DeleteMapping("/cart/{userId}/clear")
	public Cart cleanCart(@PathVariable String userId) {
		return cartService.clearCart(userId);
	}

}
