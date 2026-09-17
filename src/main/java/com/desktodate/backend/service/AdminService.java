
package com.desktodate.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.desktodate.backend.model.Admin;
import com.desktodate.backend.repository.AdminRepository;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Admin createAdmin(Admin admin) {

        if (adminRepository
                .findByEmail(admin.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        admin.setPassword(
                passwordEncoder.encode(
                        admin.getPassword()
                )
        );

        return adminRepository.save(admin);
    }

    public Admin login(
            String email,
            String password
    ) {

        Admin admin = adminRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                admin.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return admin;
    }
}

