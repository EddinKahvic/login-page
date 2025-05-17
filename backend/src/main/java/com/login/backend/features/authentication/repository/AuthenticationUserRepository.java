package com.login.backend.features.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.login.backend.features.authentication.model.AuthenticationUser;

public interface AuthenticationUserRepository extends JpaRepository<AuthenticationUser, Long>{

}
