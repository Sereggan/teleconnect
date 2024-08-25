package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.TariffSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import teleconnect.tariff.model.TariffDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;
    private final MapperUtil mapper;
    private final UserRepository userRepository;
    private final TariffSpecification tariffSpecification;

    public TariffDTO createTariff(TariffDTO tariffDTO) {
        Tariff tariff = mapper.mapTariffDTOToTariff(tariffDTO);
        return mapper.mapTariffToTariffDTO(tariffRepository.save(tariff));
    }

    public TariffDTO updateTariff(TariffDTO tariffDTO) {
        Tariff existingTariff = tariffRepository.findById(tariffDTO.getId())
                .orElseThrow(() -> new CustomRestException("Tariff not found", HttpStatus.NOT_FOUND));

        existingTariff.setName(tariffDTO.getName())
                .setDescription(tariffDTO.getDescription())
                .setPrice(tariffDTO.getPrice())
                .setCallMinutes(tariffDTO.getCallMinutes())
                .setDataLimit(tariffDTO.getDataLimit())
                .setSmsLimit(tariffDTO.getSmsLimit())
                .setValidFrom(tariffDTO.getValidFrom())
                .setValidTo(tariffDTO.getValidTo())
                .setIsActive(tariffDTO.getIsActive());

        var mappedTariff = mapper.mapTariffToTariffDTO(tariffRepository.save(existingTariff));
        mappedTariff.setIsUsed(userRepository.existsByTariff_Id(mappedTariff.getId()));
        return mappedTariff;
    }

    @SneakyThrows
    public TariffDTO getTariffById(Integer id) {
        return tariffRepository.findById(id)
                .map(mapper::mapTariffToTariffDTO)
                .map(tariffDTO -> {
                    tariffDTO.setIsUsed(userRepository.existsByTariff_Id(tariffDTO.getId()));
                    return tariffDTO;
                })
                .orElseThrow(() -> new CustomRestException("Tariff not found", HttpStatus.NOT_FOUND));
    }

    public List<TariffDTO> getAllTariffs(Double priceMin, Double priceMax, Integer dataLimitMin, Integer dataLimitMax,
                                         Integer callMinutesMin, Integer callMinutesMax, Integer smsLimitMin, Integer smsLimitMax,
                                         Boolean isActive, Boolean isUsed) {
        Specification<Tariff> specification = tariffSpecification.getTariffSpecification(priceMin, priceMax, dataLimitMin, dataLimitMax,
                callMinutesMin, callMinutesMax, smsLimitMin, smsLimitMax, isActive, isUsed);

        return tariffRepository.findAll(specification).stream()
                .map(mapper::mapTariffToTariffDTO)
                .peek(tariffDTO -> tariffDTO.setIsUsed(userRepository.existsByTariff_Id(tariffDTO.getId())))
                .toList();
    }

    public void deleteTariff(Integer id) {
        if (!userRepository.existsByTariff_Id(id)) {
            tariffRepository.deleteById(id);
        } else {
            throw new CustomRestException("Tariff is used by users", HttpStatus.CONFLICT);
        }
    }
}
