package nikolaichuks.teleconnect.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.model.UserRoleName;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.repository.UserRoleRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import teleconnect.user.model.UserDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final ObjectMapper mapper;

    public UserDto createUser(UserDto userDTO) {
        UserRole role = userRoleRepository.findByName(UserRoleName.valueOf(userDTO.getRole()))
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        User user = User.builder()
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .email(userDTO.getEmail())
                .role(role)
                .build();

        return mapper.convertValue(userRepository.save(user), UserDto.class);
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
        return mapper.convertValue(userRepository.save(user), UserDto.class);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public UserDto getUserById(Integer id) {
        return mapper.convertValue(userRepository.findById(id), UserDto.class);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    private UserDto mapToDTO(User user) {
        UserDto userDTO = new UserDto();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().getName().name());
        return userDTO;
    }
}
