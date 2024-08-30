package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.UserSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import teleconnect.user.model.UserDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MapperUtil mapper;
    private final TariffRepository tariffRepository;
    private final UserSpecification userSpecification;

    public UserDto createUser(UserDto userDTO) {
        User user = mapper.mapUserDtoToUser(userDTO);

        return mapper.mapUserToUserDto(userRepository.save(user));
    }

    public UserDto updateUser(UserDto userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new CustomRestException("User not found", HttpStatus.NOT_FOUND));
        user.setName(userDetails.getName());
        user.setSurname(userDetails.getSurname());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setEmail(userDetails.getEmail());
        if (!userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        user.setRole(UserRole.fromString(userDetails.getRole()));
        if (userDetails.getTariffId() != null) {
            tariffRepository.findById(userDetails.getTariffId())
                    .ifPresent(user::setTariff);
        }

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

    public List<UserDto> getAllUsers(String phoneNumber, String email, String name, String surname, String role, Integer tariffId) {
        Specification<User> specification = userSpecification.getUserSpecification(phoneNumber, email, name, surname, role, tariffId);

        return userRepository.findAll(specification).stream()
                .map(mapper::mapUserToUserDto)
                .toList();
    }
}
