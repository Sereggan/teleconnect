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
import teleconnect.user.model.PaginatedUserResponse;
import teleconnect.user.model.UserDto;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserService userService;

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<UserDto> getUserById(Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if (hasEmployeeRole(currentUser) || currentUser.getId().equals(id)) {
            return ResponseEntity.ok(userService.getUserById(id));
        } else {
            throw new CustomRestException("Access forbidden", HttpStatus.FORBIDDEN);
        }
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<PaginatedUserResponse> getAllUsers(String phoneNumber, String email, String name, String surname,
                                                             String role, Integer tariffId, Integer limit, Integer offset) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if (hasEmployeeRole(currentUser)) {
            PaginatedUserResponse response = userService.getAllUsers(phoneNumber, email, name, surname, role, tariffId,
                    limit, offset);
            return ResponseEntity.ok(response);
        } else {
            throw new CustomRestException("Access forbidden", HttpStatus.FORBIDDEN);
        }

    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<UserDto> createUser(UserDto userDTO) {
        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<UserDto> updateUser(UserDto userDTO) {

        return ResponseEntity.ok(userService.updateUser(userDTO));

    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<Void> deleteUser(Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private boolean hasEmployeeRole(User currentUser) {
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }
}
