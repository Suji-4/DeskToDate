
package com.desktodate.backend.service;

import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Admin;
import com.desktodate.backend.model.User;
import com.desktodate.backend.repository.AdminRepository;
import com.desktodate.backend.repository.UserRepository;
import com.desktodate.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final UserService userService;
    private final AdminService adminService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            AdminRepository adminRepository,
            UserService userService,
            AdminService adminService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.userService = userService;
        this.adminService = adminService;
        this.jwtService = jwtService;
    }

    public User registerUser(User user) {
        return userService.register(user);
    }

    public Admin registerAdmin(Admin admin) {
        return adminService.createAdmin(admin);
    }

    public AuthResponse login(String email, String password) {

        Admin admin = adminRepository
                .findByEmail(email)
                .orElse(null);

        if (admin != null) {

            Admin loggedInAdmin =
                    adminService.login(email, password);

            String token =
                    jwtService.generateToken(
                            loggedInAdmin.getEmail()
                    );

            return new AuthResponse(
                    token,
                    loggedInAdmin.getId(),
                    loggedInAdmin.getEmail(),
                    "ADMIN"
            );
        }

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user != null) {

            User loggedInUser =
                    userService.login(email, password);

            String token =
                    jwtService.generateToken(
                            loggedInUser.getEmail()
                    );

            return new AuthResponse(
                    token,
                    loggedInUser.getId(),
                    loggedInUser.getEmail(),
                    "USER"
            );
        }

        throw new RuntimeException(
                "Invalid email or password"
        );
    }

    public static class AuthResponse {

        private String token;
        private String id;
        private String email;
        private String role;

        public AuthResponse(
                String token,
                String id,
                String email,
                String role
        ) {
            this.token = token;
            this.id = id;
            this.email = email;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public String getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}

