
package com.desktodate.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desktodate.backend.model.Admin;
import com.desktodate.backend.model.User;
import com.desktodate.backend.service.AuthService;
import com.desktodate.backend.service.AuthService.AuthResponse;

@RestController
@RequestMapping("/auth")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    }
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ============================
    // USER REGISTER
    // ============================

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {

        try {

            User savedUser =
                    authService.registerUser(user);

            Map<String, Object> response =
                    new HashMap<>();

            response.put("message",
                    "User registered successfully");

            response.put("user", Map.of(
                    "id", savedUser.getId(),
                    "name", savedUser.getName(),
                    "email", savedUser.getEmail(),
                    "role", "USER"
            ));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }

    // ============================
    // ADMIN REGISTER
    // ============================

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(
            @RequestBody Admin admin
    ) {

        try {

            Admin savedAdmin =
                    authService.registerAdmin(admin);

            Map<String, Object> response =
                    new HashMap<>();

            response.put("message",
                    "Admin registered successfully");

            response.put("admin", Map.of(
                    "id", savedAdmin.getId(),
                    "email", savedAdmin.getEmail(),
                    "role", "ADMIN"
            ));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }

    // ============================
    // LOGIN
    // ============================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginData
    ) {

        String email =
                loginData.get("email");

        String password =
                loginData.get("password");

        try {

            AuthResponse authResponse =
                    authService.login(
                            email,
                            password
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "token",
                    authResponse.getToken()
            );

            response.put("user", Map.of(
                    "id", authResponse.getId(),
                    "email", authResponse.getEmail(),
                    "role", authResponse.getRole()
            ));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }
}

