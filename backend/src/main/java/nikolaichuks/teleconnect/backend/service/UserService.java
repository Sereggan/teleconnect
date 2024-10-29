package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.tariff.Tariff;
import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.repository.TariffAdjustmentRepository;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.UserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import teleconnect.user.model.PaginatedUserResponse;
import teleconnect.user.model.UserDto;

import java.util.List;

/**
 * User service
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MapperUtil mapper;
    private final TariffRepository tariffRepository;
    private final TariffAdjustmentRepository tariffAdjustmentRepository;
    private final UserSpecification userSpecification;
    private final PasswordEncoder passwordEncoder;

    public UserDto createUser(UserDto newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User user = mapper.mapUserDtoToUser(newUser);

        return mapper.mapUserToUserDto(userRepository.save(user));
    }

    public UserDto updateUser(UserDto user) {
        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new CustomRestException("User not found.", HttpStatus.NOT_FOUND));
        User updatedUser = mapper.mapUserDtoToUser(user, currentUser);

        if (user.getPassword() != null) {
            updatedUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        if (user.getTariffId() != null) {
            tariffRepository.findById(user.getTariffId())
                    .filter(Tariff::getIsActive)
                    .ifPresent(updatedUser::setTariff);
        } else {
            updatedUser.setTariff(null);
        }

        if (user.getTariffAdjustmentId() != null) {
            tariffAdjustmentRepository.findById(user.getTariffAdjustmentId())
                    .ifPresent(updatedUser::setTariffAdjustment);
        } else {
            updatedUser.setTariffAdjustment(null);
        }

        return mapper.mapUserToUserDto(userRepository.save(updatedUser));
    }

    public UserDto getUserById(Integer userId) {
        return userRepository.findById(userId)
                .map(mapper::mapUserToUserDto)
                .orElseThrow(() -> new CustomRestException("User not found.", HttpStatus.NOT_FOUND));
    }

    public PaginatedUserResponse getAllUsers(String phoneNumber, String email, String name, String familyName, String role, Integer tariffId, Integer limit, Integer offset) {
        Specification<User> specification = userSpecification.getUserSpecification(phoneNumber, email, name, familyName, role, tariffId);

        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.Direction.ASC, "name");
        Page<User> usersPage = userRepository.findAll(specification, pageRequest);

        List<UserDto> users = usersPage.getContent().stream()
                .map(mapper::mapUserToUserDto)
                .toList();

        var response = new PaginatedUserResponse();
        response.setUsers(users);
        response.setTotalItems((int) usersPage.getTotalElements());
        response.setTotalPages(usersPage.getTotalPages());
        response.setCurrentPage(offset);
        response.setItemsOnPage(users.size());

        return response;
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

}
