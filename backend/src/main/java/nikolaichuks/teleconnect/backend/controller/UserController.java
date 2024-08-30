package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.user.api.UserApi;
import teleconnect.user.model.UserDto;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserService userService;

    @Override
    public ResponseEntity<UserDto> getUserById(Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if (!hasEmployeeRole() && !currentUser.getId().equals(id)) {
            throw new CustomRestException("Access forbidden", HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Override
    public ResponseEntity<List<UserDto>> getAllUsers(String phoneNumber, String email, String name, String surname, String role, Integer tariffId) {
        List<UserDto> users = userService.getAllUsers(phoneNumber, email, name, surname, role, tariffId);
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(users);
        }
    }

    @Override
    public ResponseEntity<UserDto> createUser(UserDto userDTO) {
        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<UserDto> updateUser(UserDto userDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        if (!hasEmployeeRole()) {
            if (userDTO.getId() != null && !userDTO.getId().equals(currentUser.getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }
        return ResponseEntity.ok(userService.updateUser(userDTO));
    }

    @Override
    public ResponseEntity<Void> deleteUser(Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private boolean hasEmployeeRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }
}
