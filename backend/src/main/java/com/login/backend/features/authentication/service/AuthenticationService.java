package com.login.backend.features.authentication.service;

import org.springframework.stereotype.Service;

import com.login.backend.features.authentication.dto.AuthenticationRequestBody;
import com.login.backend.features.authentication.dto.AuthenticationResponseBody;
import com.login.backend.features.authentication.model.AuthenticationUser;
import com.login.backend.features.authentication.repository.AuthenticationUserRepository;
import com.login.backend.features.authentication.utils.Encoder;


@Service
public class AuthenticationService {
    private final Encoder encoder;
    private final AuthenticationUserRepository authenticationUserRepository;

    public AuthenticationService(AuthenticationUserRepository authenticationUserRepository, Encoder encoder) {
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
    }

    public AuthenticationUser getUser(String email) {
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        authenticationUserRepository.save(new AuthenticationUser(registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));
        return new AuthenticationResponseBody("token", "User successfully registered!");
    }
}
