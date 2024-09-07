package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.TariffAdjustmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.tariffadjustment.api.TariffAdjustmentApi;
import teleconnect.tariffadjustment.model.TariffAdjustmentDTO;

@RestController
@RequiredArgsConstructor
public class TariffAdjustmentController implements TariffAdjustmentApi {

    private final TariffAdjustmentService tariffAdjustmentService;

    @Override
    public ResponseEntity<TariffAdjustmentDTO> createTariffAdjustment(TariffAdjustmentDTO tariffAdjustmentDTO) {
        return new ResponseEntity<>(tariffAdjustmentService.createAdjustment(tariffAdjustmentDTO), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<TariffAdjustmentDTO> getTariffAdjustmentByUserId(Integer id) {
        return ResponseEntity.ok(tariffAdjustmentService.getTariffAdjustment(id));
    }

    @Override
    public ResponseEntity<TariffAdjustmentDTO> updateTariffAdjustment(TariffAdjustmentDTO tariffAdjustmentDTO) {
        return ResponseEntity.ok(tariffAdjustmentService.updateAdjustment(tariffAdjustmentDTO));
    }

    @Override
    public ResponseEntity<Void> deleteTariffAdjustment(Integer id) {
        tariffAdjustmentService.deleteAdjustment(id);
        return ResponseEntity.ok().build();
    }
}
