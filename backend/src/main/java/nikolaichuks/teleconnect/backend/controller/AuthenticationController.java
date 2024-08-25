package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.auth.api.AuthApi;
import teleconnect.auth.model.AuthResponse;
import teleconnect.auth.model.LoginRequest;
import teleconnect.auth.model.RegisterUserRequest;

@RestController
@RequiredArgsConstructor
public class AuthenticationController implements AuthApi {

    private final AuthenticationService authenticationService;

    @Override
    public ResponseEntity<AuthResponse> loginUser(LoginRequest loginRequest) {
        return ResponseEntity.ok(authenticationService.authenticate(loginRequest));
    }

    @Override
    public ResponseEntity<AuthResponse> registerUser(RegisterUserRequest registerUserRequest) {
        return new ResponseEntity<>(authenticationService.signup(registerUserRequest), HttpStatus.CREATED);
    }

}
