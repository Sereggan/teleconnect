package nikolaichuks.teleconnect.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.model.UserRoleName;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import teleconnect.user.model.UserDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final MapperUtil mapper;

    public UserDto createUser(UserDto userDTO) {
        UserRole role = userRoleRepository.findByName(UserRoleName.valueOf(userDTO.getRole()))
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        User user = User.builder()
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .email(userDTO.getEmail())
                .role(role)
                .build();

        return mapper.mapUserToUserDto(userRepository.save(user));
    }

    public UserDto updateUser(Integer id, UserDto userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserRole role = userRoleRepository.findByName(UserRoleName.valueOf(userDetails.getRole()))
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (!userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        user.setRole(role);
        return mapper.mapUserToUserDto(userRepository.save(user));
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public UserDto getUserById(Integer id) {
        return userRepository.findById(id)
                .map(mapper::mapUserToUserDto)
                .orElse(null);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(mapper::mapUserToUserDto)
                .toList();
    }
}
