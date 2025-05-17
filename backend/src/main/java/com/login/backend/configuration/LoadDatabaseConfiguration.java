package com.login.backend.configuration;

import com.login.backend.features.authentication.model.AuthenticationUser;
import com.login.backend.features.authentication.repository.AuthenticationUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadDatabaseConfiguration {

    @Bean
    public CommandLineRunner initDatabase(AuthenticationUserRepository authenticationUserRepository) {
        return args -> {
            AuthenticationUser authenticationUser = new AuthenticationUser("eddin@example.com", "secret");
            authenticationUserRepository.save(authenticationUser);
        };
    }
}
