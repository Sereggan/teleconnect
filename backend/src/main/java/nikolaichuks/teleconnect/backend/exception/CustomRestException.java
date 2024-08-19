package nikolaichuks.teleconnect.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomRestException extends RuntimeException {

    private final HttpStatus status;

    public CustomRestException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}
