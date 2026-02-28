package com.memaura.controller;

import com.memaura.model.User;
import com.memaura.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
// Origins must match your Vite port
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            // Returning 401 helps the React frontend catch the 'unauthorized' state properly
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Extract Google data
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String googleId = principal.getAttribute("sub"); // Unique ID from Google

        // Logic to check and save to MongoDB Atlas
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isEmpty()) {
            System.out.println("Saving new user to MongoDB: " + email);
            user = new User();
            user.setGoogleId(googleId);
            user.setName(name);
            user.setEmail(email);
            user = userRepository.save(user); // Persistence to Atlas
        } else {
            user = existingUser.get();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }
}