package com.desktodate.backend.repository;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Cart;
public interface CartRepository extends MongoRepository<Cart, String> {
	Optional<Cart> findByUserId(String userId);

}
