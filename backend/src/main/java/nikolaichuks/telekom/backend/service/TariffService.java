package nikolaichuks.telekom.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nikolaichuks.telekom.backend.model.Tariff;
import nikolaichuks.telekom.backend.repository.TariffRepository;
import org.springframework.stereotype.Service;
import telekom.tariff.model.TariffDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TariffDTO createTariff(TariffDTO tariffDTO) {
        Tariff tariff = Tariff.builder()
                .name(tariffDTO.getName())
                .description(tariffDTO.getDescription())
                .price(tariffDTO.getPrice())
                .dataLimit(tariffDTO.getDataLimit())
                .smsLimit(tariffDTO.getSmsLimit())
                .callMinutes(tariffDTO.getCallMinutes())
                .isActive(tariffDTO.getIsActive())
                .build();

        return objectMapper.convertValue(tariffRepository.save(tariff), TariffDTO.class);
    }

    public TariffDTO updateTariff(Integer id, TariffDTO tariffDTO) {
        return tariffRepository.findById(id)
                .map(tariff -> tariff.setName(tariffDTO.getName())
                        .setDescription(tariffDTO.getDescription())
                        .setPrice(tariffDTO.getPrice())
                        .setCallMinutes(tariffDTO.getCallMinutes())
                        .setDataLimit(tariffDTO.getDataLimit())
                        .setSmsLimit(tariffDTO.getSmsLimit())
                        .setIsActive(tariffDTO.getIsActive()))
                .map(tariffRepository::save)
                .map(updatedTariff -> objectMapper.convertValue(updatedTariff, TariffDTO.class))
                .orElseThrow(() -> new EntityNotFoundException("Tariff not found"));
    }

    public TariffDTO getTariffById(Integer id) {
        return tariffRepository.findById(id)
                .map(tariff -> objectMapper.convertValue(tariff, TariffDTO.class))
                .orElseThrow(() -> new EntityNotFoundException("Tariff not found"));
    }

    public List<TariffDTO> getAllTariffs() {
        return tariffRepository.findAll().stream()
                .map(tariff -> objectMapper.convertValue(tariff, TariffDTO.class))
                .toList();
    }

//    public List<Tariff> searchTariffs(String criteria) {
//        return tariffRepository.findByNameContaining(criteria);
//    }
}
