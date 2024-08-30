package nikolaichuks.teleconnect.backend.controller.handler;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.security.SignatureException;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler({CustomRestException.class})
    protected ResponseEntity<ApiErrorResponse> handleApiException(CustomRestException ex) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getStatus(), ex.getMessage()), ex.getStatus());
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    protected ResponseEntity<ApiErrorResponse> handleApiException(DataIntegrityViolationException ex) {
        return new ResponseEntity<>(new ApiErrorResponse(HttpStatus.CONFLICT, "Such entity already exists"), HttpStatus.CONFLICT);
    }

    @ExceptionHandler({BadCredentialsException.class})
    protected ResponseEntity<ApiErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.UNAUTHORIZED, "The username or password is incorrect");
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({AccessDeniedException.class})
    protected ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.FORBIDDEN, "You are not authorized to access this resource");
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({SignatureException.class})
    protected ResponseEntity<ApiErrorResponse> handleSignatureException(SignatureException ex) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.FORBIDDEN, "The JWT signature is invalid");
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({ExpiredJwtException.class})
    protected ResponseEntity<ApiErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.FORBIDDEN, "The JWT token has expired");
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({JwtException.class})
    protected ResponseEntity<ApiErrorResponse> handleJwtException(JwtException ex) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.FORBIDDEN, "The JWT token is malformed");
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
