package com.login.backend.configuration;

import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class EnvConfiguration {
 
    private static final Dotenv dotenv = Dotenv.configure()
        .directory(".")
        .filename(".env")
        .load();

    public static String get(String key) {
        String value = dotenv.get(key);
        if (value == null) {
            throw new IllegalArgumentException("Missing environment variable: " + key);
        }
        return value;
    }
}
