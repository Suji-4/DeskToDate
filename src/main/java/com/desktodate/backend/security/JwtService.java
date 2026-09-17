package com.desktodate.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY =
            "D2DSecretKeyForJWTAuthentication2026VerySecure";

    private final long EXPIRATION_TIME =
            1000 * 60 * 60; // 1 hour


    // Creates the secret key used to sign the JWT
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }


    // Creates a JWT token using the user's email
    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }


    // Gets the email stored inside the JWT
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    // Checks whether the JWT is valid
    public boolean isTokenValid(String token) {

        try {

            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}