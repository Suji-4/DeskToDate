
package com.desktodate.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.desktodate.backend.model.User;
import com.desktodate.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                    () -> new RuntimeException(
                        "Invalid email or password"
                    )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new RuntimeException(
                "Invalid email or password"
            );
        }

        return user;
    }
}

