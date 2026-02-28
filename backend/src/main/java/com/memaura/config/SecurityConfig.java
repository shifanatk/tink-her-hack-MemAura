package com.memaura.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // CSRF disabled for development
            .authorizeHttpRequests(auth -> auth
                // Allow static files and the auth check endpoint without a session
                .requestMatchers("/", "/index.html", "/static/**", "/error").permitAll()
                .requestMatchers("/oauth2/**", "/login/**").permitAll()
                .requestMatchers("/api/auth/me").permitAll()
                // Secure your actual app data
                .requestMatchers("/api/canvas/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                // Redirect back to your Vite dev server after Google login
                .defaultSuccessUrl("http://localhost:5173", true)
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow your Vite/React frontend specifically
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // CRUCIAL: This allows the browser to send session cookies back to Spring Boot
        configuration.setAllowCredentials(true); 
        configuration.setAllowedHeaders(List.of("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}