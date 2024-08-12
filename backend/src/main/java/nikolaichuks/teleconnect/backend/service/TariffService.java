package nikolaichuks.teleconnect.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import org.springframework.stereotype.Service;
import teleconnect.tariff.model.TariffDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;
    private final ObjectMapper mapper;

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

        return mapper.convertValue(tariffRepository.save(tariff), TariffDTO.class);
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
                .map(updatedTariff -> mapper.convertValue(updatedTariff, TariffDTO.class))
                .orElseThrow(() -> new EntityNotFoundException("Tariff not found"));
    }

    public TariffDTO getTariffById(Integer id) {
        return tariffRepository.findById(id)
                .map(tariff -> mapper.convertValue(tariff, TariffDTO.class))
                .orElseThrow(() -> new EntityNotFoundException("Tariff not found"));
    }

    public List<TariffDTO> getAllTariffs() {
        return tariffRepository.findAll().stream()
                .map(tariff -> mapper.convertValue(tariff, TariffDTO.class))
                .toList();
    }

    public void deleteTariff(Integer id){
        tariffRepository.deleteById(id);
    }
}
