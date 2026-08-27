package com.lawfirm.backend.common.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Technical security foundation only — matches the {@code security:} declarations already
 * present in docs/10-openapi.yaml. No {@code UserDetailsService}, JWT filter, or login
 * endpoint is wired here; that is the Auth business feature, implemented in a later phase.
 * Until a JWT filter populates the {@code SecurityContext}, every route below marked
 * {@code authenticated()} will reject all requests with 401 — this is expected for a
 * foundation with no working login yet.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_GET_ROUTES = {
            "/lawyers", "/lawyers/**",
            "/services", "/services/**",
            "/blogs", "/blogs/**",
            "/case-studies", "/case-studies/**",
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Actuator runs on a separate port/context (see application.yml), but
                        // this SecurityFilterChain was found, by live testing, to still govern
                        // it — without this rule, Docker/orchestrator health checks against
                        // /actuator/health get 403'd instead of 200, which looks like a crashed
                        // app to anything polling it.
                        .requestMatchers("/actuator/health", "/actuator/health/**", "/actuator/info").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/leads").permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_ROUTES).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt per docs/03-nfr.md password-hashing requirement.
        return new BCryptPasswordEncoder();
    }
}
