package nikolaichuks.telekom.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.telekom.backend.model.Tariff;
import nikolaichuks.telekom.backend.repository.TariffRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TariffService {

    private final TariffRepository tariffRepository;

    public Tariff createTariff(Tariff tariffDTO) {
//        Tariff tariff = Tariff.builder().build();
//        // Map fields from TariffDTO to Tariff
//        return tariffRepository.save(tariff);
        return Tariff.builder().build();
    }

//    public Tariff updateTariff(Long id, TariffDTO tariffDTO) {
//        Tariff tariff = tariffRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tariff not found"));
//        // Update fields
//        return tariffRepository.save(tariff);
//    }
//
//    public Tariff getTariffById(Long id) {
//        return tariffRepository.findById(id).orElseThrow(() -> new RuntimeException("Tariff not found"));
//    }
//
//    public List<Tariff> getAllTariffs() {
//        return tariffRepository.findAll();
//    }
//
//    public List<Tariff> searchTariffs(String criteria) {
//        return tariffRepository.findByNameContaining(criteria);
//    }
}
