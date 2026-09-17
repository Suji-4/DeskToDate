
package com.desktodate.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.desktodate.backend.model.Admin;

public interface AdminRepository
        extends MongoRepository<Admin, String> {

    Optional<Admin> findByEmail(String email);
}

