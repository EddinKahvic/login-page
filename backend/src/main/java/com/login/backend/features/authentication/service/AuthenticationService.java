package com.login.backend.features.authentication.service;

import org.springframework.stereotype.Service;

import com.login.backend.features.authentication.dto.AuthenticationRequestBody;
import com.login.backend.features.authentication.dto.AuthenticationResponseBody;
import com.login.backend.features.authentication.model.AuthenticationUser;
import com.login.backend.features.authentication.repository.AuthenticationUserRepository;
import com.login.backend.features.authentication.utils.Encoder;
import com.login.backend.features.authentication.utils.JsonWebToken;


@Service
public class AuthenticationService {
    private final JsonWebToken jsonWebToken;
    private final Encoder encoder;
    private final AuthenticationUserRepository authenticationUserRepository;

    public AuthenticationService(AuthenticationUserRepository authenticationUserRepository, Encoder encoder, JsonWebToken jsonWebToken) {
        this.jsonWebToken = jsonWebToken;
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
    }

    public AuthenticationUser getUser(String email) {
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        authenticationUserRepository.save(new AuthenticationUser(registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));
        String token = jsonWebToken.generateToken(registerRequestBody.getEmail());
        return new AuthenticationResponseBody(token, "User successfully registered");
    }

    public AuthenticationResponseBody login(AuthenticationRequestBody loginRequestBody) {
        // Find user with request email. If password matches, return a generated token
        AuthenticationUser user = authenticationUserRepository.findByEmail(loginRequestBody.getEmail()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!encoder.matches(loginRequestBody.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect");
        }
        String token = jsonWebToken.generateToken(loginRequestBody.getEmail());
        return new AuthenticationResponseBody(token, "Authentication succeeded");
    }
}
