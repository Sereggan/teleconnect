package nikolaichuks.teleconnect.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/*
 * Security configuration
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private static final String ROLE_EMPLOYEE = "EMPLOYEE";
    private static final String ROLE_CUSTOMER = "CUSTOMER";
    private static final String AUTH_URL = "/auth/**";
    private static final String TARIFF_URL = "/tariff/**";
    private static final String USERS_URL = "/users/**";
    private static final String TARIFF_ADJUSTMENT_URL = "/tariff-adjustment/**";
    private static final String STATISTICS_URL = "/statistics/**";
    private static final String TICKET_URL = "/ticket/**";
    private static final String DOCUMENT_URL = "/document/**";

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(AUTH_URL).permitAll()
                        .requestMatchers(HttpMethod.GET, TARIFF_URL).permitAll()
                        .requestMatchers(HttpMethod.POST, TARIFF_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.PUT, TARIFF_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.DELETE, TARIFF_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, USERS_URL).hasAnyRole(ROLE_EMPLOYEE, ROLE_CUSTOMER)
                        .requestMatchers(HttpMethod.POST, USERS_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.PUT, USERS_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.DELETE, USERS_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, TARIFF_ADJUSTMENT_URL).hasAnyRole(ROLE_EMPLOYEE, ROLE_CUSTOMER)
                        .requestMatchers(HttpMethod.POST, TARIFF_ADJUSTMENT_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.PUT, TARIFF_ADJUSTMENT_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.DELETE, TARIFF_ADJUSTMENT_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(STATISTICS_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(TICKET_URL).hasAnyRole(ROLE_EMPLOYEE, ROLE_CUSTOMER)
                        .requestMatchers(HttpMethod.GET, TICKET_URL).hasAnyRole(ROLE_EMPLOYEE, ROLE_CUSTOMER)
                        .requestMatchers(HttpMethod.POST, TICKET_URL).hasAnyRole(ROLE_EMPLOYEE, ROLE_CUSTOMER)
                        .requestMatchers(HttpMethod.PUT, TICKET_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.GET, DOCUMENT_URL).hasAnyRole(ROLE_EMPLOYEE, ROLE_CUSTOMER)
                        .requestMatchers(HttpMethod.POST, DOCUMENT_URL).hasRole(ROLE_EMPLOYEE)
                        .requestMatchers(HttpMethod.DELETE, DOCUMENT_URL).hasRole(ROLE_EMPLOYEE)

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
