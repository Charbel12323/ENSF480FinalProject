package ENSF480.uofc.Backend.config;

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
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Use defined CORS settings
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity in development (not recommended for production)
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.network https://hcaptcha.com https://*.hcaptcha.com; " +
                    "style-src 'self' 'unsafe-inline'; " +
                    "img-src 'self' data: https://*.stripe.com https://hcaptcha.com https://*.hcaptcha.com; " +
                    "frame-src https://js.stripe.com https://hcaptcha.com https://*.hcaptcha.com;"
                ))
            )
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow all requests for now (use more strict settings for production)
            );

        return http.build(); // Build the security configuration
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Allow frontend origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow common HTTP methods
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials for CORS

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply CORS to all endpoints
        return source;
    }
}