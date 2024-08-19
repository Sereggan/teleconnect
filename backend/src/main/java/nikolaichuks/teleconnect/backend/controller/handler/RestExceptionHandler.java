package nikolaichuks.teleconnect.backend.controller.handler;

import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error " + ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
