package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.auth.JwtService;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import teleconnect.auth.model.AuthResponse;
import teleconnect.auth.model.LoginRequest;
import teleconnect.auth.model.RegisterUserRequest;

@RequiredArgsConstructor
@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final MapperUtil mapperUtil;
    private final JwtService jwtService;

    public AuthResponse signup(RegisterUserRequest newUser) {
        User user = User.builder()
                .name(newUser.getName())
                .surname(newUser.getSurname())
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
                .orElseThrow(() -> new CustomRestException("User not found", HttpStatus.NOT_FOUND));
        String username;
        if (user.getEmail().equals(loginRequest.getUsername())) {
            username = user.getEmail();
        } else {
            username = user.getPhoneNumber();
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        loginRequest.getPassword()
                )
        );

        return getAuthResponse(user);
    }

    private AuthResponse getAuthResponse(User user) {
        String jwtToken = jwtService.generateToken(user);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(jwtToken);
        authResponse.setUserId(user.getId());
        authResponse.setRole(user.getRole().getName());
        return authResponse;
    }

}
