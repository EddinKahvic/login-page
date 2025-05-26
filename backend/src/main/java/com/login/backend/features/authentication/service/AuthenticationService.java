package com.login.backend.features.authentication.service;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.login.backend.features.authentication.dto.AuthenticationRequestBody;
import com.login.backend.features.authentication.dto.AuthenticationResponseBody;
import com.login.backend.features.authentication.model.AuthenticationUser;
import com.login.backend.features.authentication.repository.AuthenticationUserRepository;
import com.login.backend.features.authentication.utils.EmailService;
import com.login.backend.features.authentication.utils.Encoder;
import com.login.backend.features.authentication.utils.JsonWebToken;

import jakarta.mail.MessagingException;


@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final int durationInMinutes = 1; // Amount of minutes the token has to be validated within

    private final JsonWebToken jsonWebToken;
    private final Encoder encoder;
    private final AuthenticationUserRepository authenticationUserRepository;
    private final EmailService emailService;

    public AuthenticationService(AuthenticationUserRepository authenticationUserRepository, Encoder encoder, JsonWebToken jsonWebToken, EmailService emailService) {
        this.jsonWebToken = jsonWebToken;
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    // Creates a random 5 number verification token
    public static String generateEmailVerificationToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public void sendEmailVerificationToken(String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);
        // Only send email verification if user is not already verified
        if (user.isPresent() && !user.get().getEmailVerified()) {
            String emailVerificationToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);
            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpirationDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());
            
            String subject = "Email Verification";
            String body = String.format(
                "Enter this code to verify your email: " + "%s\n\n"
                + "The code will expire in " + "%s" + " minutes",
                emailVerificationToken, durationInMinutes);

            try {
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                logger.info("Error whilst sending email: {}", e.getMessage());
            }
        }
    }

    public void validateEmailVerificationToken(String token, String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken()) && !user.get().getEmailVerificationTokenExpirationDate().isBefore(LocalDateTime.now())) {
            user.get().setEmailVerified(true);
            user.get().setEmailVerificationToken(null);
            user.get().setEmailVerificationTokenExpirationDate(null);
            authenticationUserRepository.save(user.get());
        } else if(user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken()) && user.get().getEmailVerificationTokenExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalCallerException("Email verification token expired");
        } else {
            throw new IllegalStateException("Email verification token failed");
        }
    }

    public AuthenticationUser getUser(String email) {
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        AuthenticationUser user = authenticationUserRepository.save(new AuthenticationUser(registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));
        
        String emailVerificationToken = generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);
        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpirationDate(LocalDateTime.now().plusMinutes(durationInMinutes));
        authenticationUserRepository.save(user); 

        String subject = "Email Verification";
        String body = String.format(
            "Enter this code to verify your email: " + "%s\n\n"
            + "The code will expire in " + "%s" + " minutes",
            emailVerificationToken, durationInMinutes);

        try {
            emailService.sendEmail(registerRequestBody.getEmail(), subject, body);
        } catch (Exception e) {
            logger.info("Error whilst sending email: {}", e.getMessage());
        }

        String authToken = jsonWebToken.generateToken(registerRequestBody.getEmail());
        return new AuthenticationResponseBody(authToken, "User registered successfully");
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

    public void sendPasswordResetToken(String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);

        if (user.isPresent()) {
            String passwordResetToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(passwordResetToken);
            user.get().setPasswordResetToken(hashedToken);
            user.get().setPasswordResetTokenExpirationDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());

            String subject = "Password Rest";
            String body = String.format(
                "Enter this code to reset your password: " + "%s\n\n"
                + "The code will expire in " + "%s" + " minutes",
                passwordResetToken, durationInMinutes);

            try {
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                logger.info("Error whilst sending email: {}", e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    public void resetPassword(String email, String newPassword, String token) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken()) && !user.get().getPasswordResetTokenExpirationDate().isBefore(LocalDateTime.now())) {
            user.get().setPasswordResetToken(null);
            user.get().setPasswordResetTokenExpirationDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            user.get().setPassword(encoder.encode(newPassword));
            authenticationUserRepository.save(user.get());
        } else if(user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken()) && user.get().getPasswordResetTokenExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalCallerException("Password reset token expired");
        } else {
            throw new IllegalStateException("Password reset token failed");
        }
    }
}
