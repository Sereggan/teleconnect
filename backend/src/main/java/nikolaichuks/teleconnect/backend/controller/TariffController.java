package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.service.TariffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.tariff.api.TariffApi;
import teleconnect.tariff.model.PaginatedTariffResponse;
import teleconnect.tariff.model.TariffDTO;

@RestController
@RequiredArgsConstructor
public class TariffController implements TariffApi {

    private final TariffService tariffService;

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TariffDTO> getTariffById(Integer id) {
        return ResponseEntity.ok(tariffService.getTariffById(id));
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<PaginatedTariffResponse> getAllTariffs(Double priceMin, Double priceMax,
                                                                 Integer dataLimitMin, Integer dataLimitMax,
                                                                 Integer callMinutesMin, Integer callMinutesMax,
                                                                 Integer smsLimitMin, Integer smsLimitMax,
                                                                 Boolean isActive, Boolean isUsed,
                                                                 Integer limit, Integer offset) {
        PaginatedTariffResponse response = tariffService.getAllTariffs(priceMin, priceMax, dataLimitMin, dataLimitMax,
                callMinutesMin, callMinutesMax, smsLimitMin, smsLimitMax, isActive, isUsed, limit, offset);

        return ResponseEntity.ok(response);
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TariffDTO> createTariff(TariffDTO tariffDTO) {
        return new ResponseEntity<>(tariffService.createTariff(tariffDTO), HttpStatus.CREATED);
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TariffDTO> updateTariff(TariffDTO tariffDTO) {
        return ResponseEntity.ok(tariffService.updateTariff(tariffDTO));
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<Void> deleteTariff(Integer id) {
        tariffService.deleteTariff(id);
        return ResponseEntity.ok().build();
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TariffDTO> getTariffByUserId(Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        if (hasEmployeeRole() || id.equals(currentUser.getId())) {
            return ResponseEntity.ok(tariffService.getTariffByUserId(id));
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    private boolean hasEmployeeRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }
}
