package nikolaichuks.teleconnect.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import teleconnect.user.model.UserDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MapperUtil mapper;

    public UserDto createUser(UserDto userDTO) {
        User user = mapper.mapUserDtoToUser(userDTO);

        return mapper.mapUserToUserDto(userRepository.save(user));
    }

    public UserDto updateUser(Integer id, UserDto userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setName(userDetails.getName());
        user.setSurname(userDetails.getSurname());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setEmail(userDetails.getEmail());
        if (!userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        user.setRole(UserRole.fromString(userDetails.getRole()));
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
