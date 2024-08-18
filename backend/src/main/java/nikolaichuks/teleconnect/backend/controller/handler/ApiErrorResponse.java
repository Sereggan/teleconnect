package nikolaichuks.teleconnect.backend.controller.handler;

import org.springframework.http.HttpStatus;

public record ApiErrorResponse(HttpStatus status, String message) {
}
