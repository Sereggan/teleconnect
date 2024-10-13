package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.jwt.JwtService;
import nikolaichuks.teleconnect.backend.model.*;
import nikolaichuks.teleconnect.backend.repository.PasswordResetTokenRepository;
import nikolaichuks.teleconnect.backend.repository.TokenBlacklistRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import teleconnect.auth.model.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

/**
 * Authentication service
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    @Value("${security.jwt.reset-password-expiration-time}")
    private long resetPasswordJwtExpiration;

    private final UserRepository userRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthResponse signup(RegisterUserRequest newUser) {
        var user = User.builder()
                .name(newUser.getName())
                .familyName(newUser.getFamilyName())
                .email(newUser.getEmail())
                .phoneNumber(newUser.getPhoneNumber())
                .password(passwordEncoder.encode(newUser.getPassword()))
                .role(UserRole.ROLE_CUSTOMER)
                .build();
        userRepository.save(user);

        return getAuthResponse(user);
    }

    public AuthResponse authenticate(LoginRequest loginRequest) {
        User user = userRepository.findByEmailOrPhoneNumber(loginRequest.getUsername())
                .orElseThrow(() -> new CustomRestException("Auth error", HttpStatus.UNAUTHORIZED));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        loginRequest.getPassword()
                )
        );

        return getAuthResponse(user);
    }

    public AuthResponse refreshToken(TokenRefreshRequest tokenRefreshRequest) {
        String token = tokenRefreshRequest.getRefreshToken();
        String username = jwtService.extractRefreshTokenUsername(token);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new CustomRestException("User not found", HttpStatus.NOT_FOUND));

        if (tokenBlacklistRepository.findByUser(user).getToken().equals(token)) {
            throw new CustomRestException("Token is invalid.", HttpStatus.UNAUTHORIZED);
        }

        if (jwtService.isRefreshTokenValid(token, user)) {
            return getAuthResponse(user);
        } else {
            throw new CustomRestException("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    public void logout(LogoutRequest tokenRequest) {
        String accessToken = tokenRequest.getToken();
        String refreshToken = tokenRequest.getRefreshToken();

        String username = jwtService.extractUsername(accessToken);
        String refreshTokenUsername = jwtService.extractRefreshTokenUsername(accessToken);
        if (!username.equals(refreshTokenUsername)) {
            throw new CustomRestException("Invalid pair of provided tokens.", HttpStatus.BAD_REQUEST);
        }

        LocalDateTime expirationDate = jwtService.extractExpiryDate(accessToken).toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new CustomRestException("User not found", HttpStatus.NOT_FOUND));

        var invalidAccessToken = new TokenBlacklist();
        invalidAccessToken.setUser(user);
        invalidAccessToken.setToken(accessToken);
        invalidAccessToken.setExpiryDate(expirationDate);
        invalidAccessToken.setTokenType(TokenType.ACCESS_TOKEN);

        LocalDateTime refreshTokenExpirationDate = jwtService.extractRefreshTokenExpiryDate(refreshToken).toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        TokenBlacklist invalidRefreshToken = new TokenBlacklist();
        invalidRefreshToken.setUser(user);
        invalidRefreshToken.setToken(refreshToken);
        invalidRefreshToken.setExpiryDate(refreshTokenExpirationDate);
        invalidRefreshToken.setTokenType(TokenType.REFRESH_TOKEN);

        tokenBlacklistRepository.saveAll(List.of(invalidAccessToken, invalidRefreshToken));
    }

    @Async
    public void sendResetPasswordMail(String email) {
        userRepository.findByEmail(email)
                .ifPresent(user -> {
                    LocalDateTime expiryDate = LocalDateTime.now()
                            .plus(resetPasswordJwtExpiration, ChronoUnit.MILLIS);
                    String code = generateSecretCode();
                    PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                            .code(code)
                            .user(user)
                            .expiryDate(expiryDate)
                            .build();
                    passwordResetTokenRepository.save(passwordResetToken);

                    emailService.sendSimpleMessage(email, "Reset password", String.format("Your reset password code is: %s\n" +
                            "if you don't know why you got this message just ignore it.", code));
                });
    }

    public String validateResetPasswordCode(String email, String code) {
        Optional<PasswordResetToken> passwordResetToken = passwordResetTokenRepository.findByCode(code);
        if (passwordResetToken.isPresent()) {
            PasswordResetToken token = passwordResetToken.get();
            if (token.getUser().getEmail().equals(email) && token.getExpiryDate().isAfter(LocalDateTime.now())) {
                return jwtService.generateResetPasswordToken(token.getUser());
            } else {
                throw new CustomRestException("Invalid code", HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new CustomRestException("Invalid code", HttpStatus.BAD_REQUEST);
        }
    }

    public void resetPassword(String token, String newPassword) {
        userRepository.findByEmail(jwtService.extractResetPasswordTokenEmail(token))
                .ifPresentOrElse(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                },() -> {
                    throw new CustomRestException("User not found", HttpStatus.NOT_FOUND);
                });
    }

    private AuthResponse getAuthResponse(User user) {
        HashMap<String, String> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().getName());
        String accessToken = jwtService.generateToken(user, claims);
        String generateRefreshToken = jwtService.generateRefreshToken(user);

        var authResponse = new AuthResponse();
        authResponse.setToken(accessToken);
        authResponse.setRefreshToken(generateRefreshToken);
        authResponse.setUserId(user.getId());
        authResponse.setRole(user.getRole().getName());
        return authResponse;
    }

    private String generateSecretCode() {
        SecureRandom secureRandom = new SecureRandom();
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

}
