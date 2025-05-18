package com.login.backend.features.authentication.utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.springframework.stereotype.Component;

@Component
public class Encoder {

    public String encode(String rawString) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            // Convert input string into bytes, hash inputBytes using SHA-256, encode into readable string using Base64
            byte[] inputBytes = rawString.getBytes(StandardCharsets.UTF_8);
            return Base64.getEncoder().encodeToString(digest.digest(inputBytes));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error encoding string:", e);
        }
    }

    public boolean matches(String rawString, String encodedString) {
        return encode(rawString).equals(encodedString);
    }
}
