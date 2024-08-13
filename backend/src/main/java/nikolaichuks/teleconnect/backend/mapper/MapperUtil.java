package nikolaichuks.teleconnect.backend.mapper;

import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;
import teleconnect.tariff.model.TariffDTO;
import teleconnect.user.model.UserDto;

@Component
public class MapperUtil {

    ModelMapper mapper = new ModelMapper();

    public MapperUtil() {
        Converter<UserRole, String> userRoleToStringConverter = context -> context.getSource().getName();
        Converter<String, UserRole> userRoleConverter = context -> UserRole.fromString(context.getSource());

        mapper.addMappings(new PropertyMap<User, UserDto>() {
            @Override
            protected void configure() {
                map(source.getTariff().getId(), destination.getTariffId());
                using(userRoleToStringConverter).map(source.getRole()).setRole(null);
            }
        });
        mapper.addMappings(new PropertyMap<UserDto, User>() {
            @Override
            protected void configure() {
                skip(destination.getId());
                using(userRoleConverter).map(source.getRole()).setRole(null);
            }
        });

        mapper.addMappings(new PropertyMap<TariffDTO, Tariff>() {
            @Override
            protected void configure() {
                skip(destination.getId());
            }
        });

    }

    public UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }

    public User mapUserDtoToUser(UserDto user) {
        return mapper.map(user, User.class);
    }

    public TariffDTO mapTariffToTariffDTO(Tariff tariff) {
        return mapper.map(tariff, TariffDTO.class);
    }

    public Tariff mapTariffDTOToTariff(TariffDTO tariffDTO) {
        return mapper.map(tariffDTO, Tariff.class);
    }
}
