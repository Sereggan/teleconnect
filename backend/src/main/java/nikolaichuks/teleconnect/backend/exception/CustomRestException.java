package nikolaichuks.teleconnect.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.ErrorResponse;

@Getter
public class CustomRestException extends RuntimeException {

    private final HttpStatus status;

    public CustomRestException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}
