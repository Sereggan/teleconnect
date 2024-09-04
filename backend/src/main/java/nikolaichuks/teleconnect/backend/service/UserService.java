package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.UserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import teleconnect.user.model.PaginatedUserResponse;
import teleconnect.user.model.PaginatedUserResponsePagination;
import teleconnect.user.model.UserDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MapperUtil mapper;
    private final TariffRepository tariffRepository;
    private final UserSpecification userSpecification;
    private final PasswordEncoder passwordEncoder;

    public UserDto createUser(UserDto userDTO) {
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
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

    public PaginatedUserResponse getAllUsers(String phoneNumber, String email, String name, String surname, String role, Integer tariffId, Integer limit, Integer offset) {
        Specification<User> specification = userSpecification.getUserSpecification(phoneNumber, email, name, surname, role, tariffId);

        PageRequest pageRequest = PageRequest.of(offset, limit);
        Page<User> usersPage = userRepository.findAll(specification, pageRequest);

        List<UserDto> users = usersPage.getContent().stream()
                .map(mapper::mapUserToUserDto)
                .toList();

        PaginatedUserResponse response = new PaginatedUserResponse();
        response.setData(users);
        var pagination = new PaginatedUserResponsePagination();
        pagination.setTotalItems((int) usersPage.getTotalElements());
        pagination.setTotalPages(usersPage.getTotalPages());
        pagination.setCurrentPage(offset);
        pagination.setItemsOnPage(users.size());
        response.setPagination(pagination);

        return response;
    }
}
