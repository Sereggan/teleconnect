package nikolaichuks.teleconnect.backend.mapper;

import nikolaichuks.teleconnect.backend.model.tariff.Tariff;
import nikolaichuks.teleconnect.backend.model.tariff.TariffAdjustment;
import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.model.user.UserRole;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Component;
import teleconnect.tariff.model.TariffDTO;
import teleconnect.tariffadjustment.model.TariffAdjustmentDTO;
import teleconnect.user.model.UserDto;

/**
 * Mapper utility
 */
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
                map(source.getTariffAdjustment().getId(), destination.getTariffAdjustmentId());
                using(userRoleToStringConverter).map(source.getRole()).setRole(null);
                skip(destination.getPassword());
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

    public User mapUserDtoToUser(UserDto source, User target) {
        return target.setName(source.getName())
                .setFamilyName(source.getFamilyName())
                .setPhoneNumber(source.getPhoneNumber())
                .setEmail(source.getEmail())
                .setRole(UserRole.fromString(source.getRole()))
                .setBirthDate(source.getBirthDate());
    }

    public TariffDTO mapTariffToTariffDto(Tariff tariff) {
        return mapper.map(tariff, TariffDTO.class);
    }

    public Tariff mapTariffToTariffDto(TariffDTO sourceTariff, Tariff targetTariff) {
        return targetTariff.setName(sourceTariff.getName())
                .setDescription(sourceTariff.getDescription())
                .setPrice(sourceTariff.getPrice())
                .setCallMinutes(sourceTariff.getCallMinutes())
                .setDataLimit(sourceTariff.getDataLimit())
                .setSmsLimit(sourceTariff.getSmsLimit())
                .setIsActive(sourceTariff.getIsActive());
    }

    public Tariff mapTariffDtoToTariff(TariffDTO tariffDTO) {
        return mapper.map(tariffDTO, Tariff.class);
    }

    public TariffAdjustmentDTO mapTariffAdjustmentToTariffAdjustmentDto(TariffAdjustment tariffAdjustment) {
        return mapper.map(tariffAdjustment, TariffAdjustmentDTO.class);
    }


    public TariffAdjustment mapTariffAdjustmentDtoToTariffAdjustment(TariffAdjustmentDTO adjustmentDTO) {
        return mapper.map(adjustmentDTO, TariffAdjustment.class);
    }

    public TariffAdjustment mapTariffAdjustmentDtoToTariffAdjustment(TariffAdjustmentDTO source, TariffAdjustment target) {
        target.setPrice(source.getPrice());
        target.setCallMinutes(source.getCallMinutes());
        target.setCallMinutes(source.getCallMinutes());
        target.setDataLimit(source.getDataLimit());
        return target;
    }
}
