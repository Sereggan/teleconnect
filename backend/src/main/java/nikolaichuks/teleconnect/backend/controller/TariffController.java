package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.TariffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.tariff.api.TariffApi;
import teleconnect.tariff.model.TariffDTO;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TariffController implements TariffApi {

    private final TariffService tariffService;

    @Override
    public ResponseEntity<TariffDTO> getTariffById(Integer id) {
        return ResponseEntity.ok(tariffService.getTariffById(id));
    }

    @Override
    public ResponseEntity<List<TariffDTO>> getAllTariffs() {
        return ResponseEntity.ok(tariffService.getAllTariffs());
    }

    @Override
    public ResponseEntity<TariffDTO> createTariff(TariffDTO tariffDTO) {
        return ResponseEntity.ok(tariffService.createTariff(tariffDTO));
    }

    @Override
    public ResponseEntity<TariffDTO> updateTariff(Integer id, TariffDTO tariffDTO) {
        return ResponseEntity.ok(tariffService.updateTariff(id, tariffDTO));
    }
}
