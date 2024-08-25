package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.service.TariffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        boolean isAuthenticated = isEmployee();
        if (!isAuthenticated) throw new CustomRestException("Access forbidden", HttpStatus.FORBIDDEN);

        return new ResponseEntity<>(tariffService.createTariff(tariffDTO), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<TariffDTO> updateTariff(TariffDTO tariffDTO) {
        boolean isAuthenticated = isEmployee();
        if (!isAuthenticated) throw new CustomRestException("Access forbidden", HttpStatus.FORBIDDEN);

        return ResponseEntity.ok(tariffService.updateTariff(tariffDTO));
    }

    @Override
    public ResponseEntity<Void> deleteTariff(Integer id) {
        boolean isAuthenticated = isEmployee();
        if (!isAuthenticated) throw new CustomRestException("Access forbidden", HttpStatus.FORBIDDEN);

        tariffService.deleteTariff(id);
        return ResponseEntity.ok().build();
    }

    private boolean isEmployee() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }

}
