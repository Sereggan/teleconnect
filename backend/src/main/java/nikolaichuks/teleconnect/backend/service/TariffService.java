package nikolaichuks.teleconnect.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import org.springframework.stereotype.Service;
import teleconnect.tariff.model.TariffDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;
    private final MapperUtil mapper;

    public TariffDTO createTariff(TariffDTO tariffDTO) {
        Tariff tariff = mapper.mapTariffDTOToTariff(tariffDTO);
        return mapper.mapTariffToTariffDTO(tariffRepository.save(tariff));
    }

    public TariffDTO updateTariff(Integer id, TariffDTO tariffDTO) {
        Tariff existingTariff = tariffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tariff not found"));

        existingTariff.setName(tariffDTO.getName())
                .setDescription(tariffDTO.getDescription())
                .setPrice(tariffDTO.getPrice())
                .setCallMinutes(tariffDTO.getCallMinutes())
                .setDataLimit(tariffDTO.getDataLimit())
                .setSmsLimit(tariffDTO.getSmsLimit())
                .setIsActive(tariffDTO.getIsActive());

        return mapper.mapTariffToTariffDTO(tariffRepository.save(existingTariff));
    }

    public TariffDTO getTariffById(Integer id) {
        return tariffRepository.findById(id)
                .map(mapper::mapTariffToTariffDTO)
                .orElseThrow(() -> new EntityNotFoundException("Tariff not found"));
    }

    public List<TariffDTO> getAllTariffs() {
        return tariffRepository.findAll().stream()
                .map(mapper::mapTariffToTariffDTO)
                .toList();
    }

    public void deleteTariff(Integer id) {
        tariffRepository.deleteById(id);
    }
}
