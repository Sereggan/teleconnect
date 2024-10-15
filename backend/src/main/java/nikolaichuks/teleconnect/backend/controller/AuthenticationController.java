package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.auth.api.AuthApi;
import teleconnect.auth.model.*;

@RestController
@RequiredArgsConstructor
public class AuthenticationController implements AuthApi {

    private final AuthenticationService authenticationService;

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<AuthResponse> signInUser(LoginRequest loginRequest) {
        return ResponseEntity.ok(authenticationService.authenticate(loginRequest));
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<AuthResponse> refreshToken(TokenRefreshRequest tokenRefreshRequest) {
        return ResponseEntity.ok(authenticationService.refreshToken(tokenRefreshRequest));
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<Void> logoutUser(LogoutRequest logoutRequest) {
        authenticationService.logout(logoutRequest);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> sendResetPasswordMail(String email) {
        authenticationService.sendResetPasswordMail(email);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<ResetPasswordTokenResponse> validateResetPasswordCode(String email, String code) {
        String token = authenticationService.validateResetPasswordCode(email, code);
        return ResponseEntity.ok(new ResetPasswordTokenResponse().resetToken(token));
    }

    @Override
    public ResponseEntity<Void> resetPassword(String token, String newPassword) {
        authenticationService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }
}
