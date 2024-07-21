package nikolaichuks.telekom.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.telekom.backend.service.TariffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import telekom.tariff.api.TariffApi;
import telekom.tariff.model.TariffDTO;

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
        return ResponseEntity.ok(List.of(new TariffDTO().id(2)));
    }

    @Override
    public ResponseEntity<TariffDTO> createTariff(TariffDTO tariffDTO) {
        return ResponseEntity.ok(new TariffDTO().id(3));
    }

    @Override
    public ResponseEntity<TariffDTO> updateTariff(Integer id, TariffDTO tariffDTO) {
        return ResponseEntity.ok(new TariffDTO().id(4));
    }
}
