package nikolaichuks.teleconnect.backend.mapper;

import nikolaichuks.teleconnect.backend.model.User;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;
import teleconnect.user.model.UserDto;

@Component
public class MapperUtil {

    ModelMapper mapper = new ModelMapper();

    public MapperUtil() {
        Converter<User, String> roleConverter = context -> context.getSource().getRole().getName().name();

        mapper.addMappings(new PropertyMap<User, UserDto>() {
            @Override
            protected void configure() {
                using(roleConverter).map(source).setRole(null);
                map(source.getTariff().getId(), destination.getTariffId());
            }
        });
    }

    public UserDto mapUserToUserDto(User user) {
        return mapper.map(user, UserDto.class);
    }
}
