package nikolaichuks.teleconnect.backend.mapper;

import nikolaichuks.teleconnect.backend.model.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;
import teleconnect.user.model.UserDto;

@Component
public class MapperUtil {

    ModelMapper mapper = new ModelMapper();

    public MapperUtil() {

        mapper.addMappings(new PropertyMap<User, UserDto>() {
            @Override
            protected void configure() {
                map(source.getTariff().getId(), destination.getTariffId());
            }
        });
    }

    public UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }

    public User mapUserDtoToUser(UserDto user) {
        return mapper.map(user, User.class);
    }
}
