package com.memaura.repository;

import com.memaura.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> { // Use String here to match the User ID
    Optional<User> findByEmail(String email);
}