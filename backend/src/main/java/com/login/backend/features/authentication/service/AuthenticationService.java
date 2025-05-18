package com.login.backend.features.authentication.service;

import org.springframework.stereotype.Service;

import com.login.backend.features.authentication.model.AuthenticationUser;
import com.login.backend.features.authentication.repository.AuthenticationUserRepository;

@Service
public class AuthenticationService {
    private final AuthenticationUserRepository authenticationUserRepository;

    public AuthenticationService(AuthenticationUserRepository authenticationUserRepository) {
        this.authenticationUserRepository = authenticationUserRepository;
    }

    public AuthenticationUser getUser(String email) {
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
