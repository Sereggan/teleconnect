package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.TariffService;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<List<TariffDTO>> getAllTariffs(Double priceMin,
                                                         Double priceMax,
                                                         Integer dataLimitMin,
                                                         Integer dataLimitMax,
                                                         Integer callMinutesMin,
                                                         Integer callMinutesMax,
                                                         Integer smsLimitMin,
                                                         Integer smsLimitMax,
                                                         Boolean isActive,
                                                         Boolean isUsed) {
        List<TariffDTO> tariffs = tariffService.getAllTariffs(priceMin, priceMax, dataLimitMin,
                dataLimitMax, callMinutesMin, callMinutesMax, smsLimitMin, smsLimitMax, isActive, isUsed);
        if (tariffs.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(tariffs);
        }
    }

    @Override
    public ResponseEntity<TariffDTO> createTariff(TariffDTO tariffDTO) {
        return new ResponseEntity<>(tariffService.createTariff(tariffDTO), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<TariffDTO> updateTariff(TariffDTO tariffDTO) {
        return ResponseEntity.ok(tariffService.updateTariff(tariffDTO));
    }

    @Override
    public ResponseEntity<Void> deleteTariff(Integer id) {
        tariffService.deleteTariff(id);
        return ResponseEntity.ok().build();
    }

//    @Override
//    public ResponseEntity<List<TariffDTO>> searchTariffs(
//            Double priceMin,
//            Double priceMax,
//            Integer dataLimitMin,
//            Integer dataLimitMax,
//            Integer callMinutesMin,
//            Integer callMinutesMax,
//            Integer smsLimitMin,
//            Integer smsLimitMax,
//            Boolean isActive,
//            Boolean isUsed
//    ) {
//        return
//    }
}
