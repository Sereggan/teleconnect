package nikolaichuks.teleconnect.backend.service;

import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.model.TariffAdjustment;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.repository.TariffAdjustmentRepository;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.UserSpecification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import teleconnect.user.model.PaginatedUserResponse;
import teleconnect.user.model.UserDto;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    private static final Integer USER_ID = 1;
    private static final Integer TARIFF_ID = 2;
    private static final Integer TARIFF_ADJUSTMENT_ID = 3;

    private static final String PASSWORD = "password";
    private static final String ENCODED_PASSWORD = "encodedPassword";
    private static final String USER_NOT_FOUND_EXCEPTION_MESSAGE = "User not found.";

    @Mock
    UserRepository userRepository;
    @Mock
    MapperUtil mapperUtil;
    @Mock
    TariffRepository tariffRepository;
    @Mock
    TariffAdjustmentRepository tariffAdjustmentRepository;
    @Mock
    UserSpecification userSpecification;
    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldCreateUser() {
        UserDto newUser = mock(UserDto.class);
        User mappedUser = mock(User.class);
        User savedUser = mock(User.class);
        UserDto savedUserDto = mock(UserDto.class);

        when(newUser.getPassword()).thenReturn(PASSWORD);
        when(passwordEncoder.encode(any())).thenReturn(ENCODED_PASSWORD);
        when(mapperUtil.mapUserDtoToUser(any())).thenReturn(mappedUser);
        when(userRepository.save(any())).thenReturn(savedUser);
        when(mapperUtil.mapUserToUserDto(any())).thenReturn(savedUserDto);

        var result = userService.createUser(newUser);

        verify(newUser).setPassword(ENCODED_PASSWORD);
        verify(passwordEncoder).encode(newUser.getPassword());
        verify(mapperUtil).mapUserDtoToUser(newUser);
        verify(userRepository).save(mappedUser);
        verify(mapperUtil).mapUserToUserDto(savedUser);
        assertThat(result).isEqualTo(savedUserDto);
    }

    @Test
    void shouldUpdateUser() {
        UserDto userToUpdate = mock(UserDto.class);
        User existingUser = mock(User.class);
        User mappedUser = mock(User.class);
        User savedUser = mock(User.class);
        UserDto updatedUserDto = mock(UserDto.class);

        when(userToUpdate.getPassword()).thenReturn(null);
        when(userToUpdate.getTariffId()).thenReturn(null);
        when(userToUpdate.getTariffAdjustmentId()).thenReturn(null);

        when(userToUpdate.getId()).thenReturn(USER_ID);
        when(userRepository.findById(any())).thenReturn(Optional.of(existingUser));
        when(mapperUtil.mapUserDtoToUser(userToUpdate, existingUser)).thenReturn(mappedUser);
        when(userRepository.save(any())).thenReturn(savedUser);
        when(mapperUtil.mapUserToUserDto(any())).thenReturn(updatedUserDto);

        var result = userService.updateUser(userToUpdate);

        verify(userRepository).findById(USER_ID);
        verify(mapperUtil).mapUserDtoToUser(userToUpdate, existingUser);
        verify(userRepository).save(mappedUser);
        verify(mapperUtil).mapUserToUserDto(savedUser);
        assertThat(result).isEqualTo(updatedUserDto);

        verify(mappedUser, never()).setPassword(any());
        verify(tariffRepository, never()).findById(any());
        verify(mappedUser).setTariff(null);
        verify(tariffAdjustmentRepository, never()).findById(any());
        verify(mappedUser).setTariffAdjustment(null);
    }

    @Test
    void shouldUpdateUserWithAllFields() {
        UserDto userToUpdate = mock(UserDto.class);
        User existingUser = mock(User.class);
        User mappedUser = mock(User.class);
        User savedUser = mock(User.class);
        UserDto updatedUserDto = mock(UserDto.class);
        Tariff tariff = mock(Tariff.class);
        TariffAdjustment tariffAdjustment = mock(TariffAdjustment.class);

        when(userToUpdate.getPassword()).thenReturn(PASSWORD);
        when(userToUpdate.getTariffId()).thenReturn(TARIFF_ID);
        when(userToUpdate.getTariffAdjustmentId()).thenReturn(TARIFF_ADJUSTMENT_ID);

        when(userToUpdate.getId()).thenReturn(USER_ID);
        when(userRepository.findById(any())).thenReturn(Optional.of(existingUser));
        when(mapperUtil.mapUserDtoToUser(userToUpdate, existingUser)).thenReturn(mappedUser);
        when(passwordEncoder.encode(any())).thenReturn(ENCODED_PASSWORD);
        when(tariffRepository.findById(any())).thenReturn(Optional.of(tariff));
        when(tariffAdjustmentRepository.findById(TARIFF_ADJUSTMENT_ID)).thenReturn(Optional.of(tariffAdjustment));
        when(userRepository.save(any())).thenReturn(savedUser);
        when(mapperUtil.mapUserToUserDto(any())).thenReturn(updatedUserDto);

        var result = userService.updateUser(userToUpdate);

        verify(userRepository).findById(USER_ID);
        verify(mapperUtil).mapUserDtoToUser(userToUpdate, existingUser);
        verify(userRepository).save(mappedUser);
        verify(mapperUtil).mapUserToUserDto(savedUser);
        assertThat(result).isEqualTo(updatedUserDto);

        verify(mappedUser).setPassword(ENCODED_PASSWORD);
        verify(tariffRepository).findById(TARIFF_ID);
        verify(mappedUser).setTariff(tariff);
        verify(tariffAdjustmentRepository).findById(TARIFF_ADJUSTMENT_ID);
        verify(mappedUser).setTariffAdjustment(tariffAdjustment);
    }

    @Test
    void shouldUpdateUserAndThrowNotFoundException() {
        UserDto userToUpdate = mock(UserDto.class);

        when(userToUpdate.getId()).thenReturn(USER_ID);
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        CustomRestException exception = assertThrows(CustomRestException.class, () -> userService.updateUser(userToUpdate));

        verify(userRepository).findById(USER_ID);
        assertThat(exception.getMessage()).isEqualTo(USER_NOT_FOUND_EXCEPTION_MESSAGE);
        assertThat(exception.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
    }


    @Test
    void shouldGetUserById() {
        User existingUser = mock(User.class);
        UserDto userDto = mock(UserDto.class);

        when(userRepository.findById(any())).thenReturn(Optional.of(existingUser));
        when(mapperUtil.mapUserToUserDto(any())).thenReturn(userDto);

        var result = userService.getUserById(USER_ID);

        verify(userRepository).findById(USER_ID);
        verify(mapperUtil).mapUserToUserDto(existingUser);
        assertThat(result).isEqualTo(userDto);
    }

    @Test
    void shouldGetUserByIdAndThrowNotFoundException() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        CustomRestException exception = assertThrows(CustomRestException.class, () -> userService.getUserById(USER_ID));

        verify(userRepository).findById(USER_ID);
        assertThat(exception.getMessage()).isEqualTo(USER_NOT_FOUND_EXCEPTION_MESSAGE);
        assertThat(exception.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @SuppressWarnings("unchecked")
    void shouldGetAllUsers() {
        String phoneNumber = "123";
        String email = "email@test.com";
        String name = "John";
        String familyName = "Doe";
        String role = "ROLE_USER";
        Integer limit = 10;
        Integer offset = 0;

        Specification<User> specification = mock(Specification.class);
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.Direction.ASC, "name");
        User user = mock(User.class);
        UserDto userDto = mock(UserDto.class);
        List<User> userList = List.of(user);
        Page<User> usersPage = new PageImpl<>(userList, pageRequest, 1);

        when(userSpecification.getUserSpecification(any(), any(), any(), any(), any(), any())).thenReturn(specification);
        when(userRepository.findAll(specification, pageRequest)).thenReturn(usersPage);
        when(mapperUtil.mapUserToUserDto(any())).thenReturn(userDto);

        PaginatedUserResponse result = userService.getAllUsers(phoneNumber, email, name, familyName, role, TARIFF_ID, limit, offset);

        verify(userSpecification).getUserSpecification(phoneNumber, email, name, familyName, role, TARIFF_ID);
        verify(userRepository).findAll(specification, pageRequest);
        verify(mapperUtil).mapUserToUserDto(user);

        assertThat(result).isNotNull();
        assertThat(result.getUsers()).contains(userDto);
        assertThat(result.getPagination().getTotalItems()).isEqualTo(1);
        assertThat(result.getPagination().getTotalPages()).isEqualTo(1);
        assertThat(result.getPagination().getCurrentPage()).isEqualTo(offset);
        assertThat(result.getPagination().getItemsOnPage()).isEqualTo(1);
    }


    @Test
    void shouldDeleteUser() {
        userService.deleteUser(USER_ID);

        verify(userRepository).deleteById(USER_ID);
    }

}
