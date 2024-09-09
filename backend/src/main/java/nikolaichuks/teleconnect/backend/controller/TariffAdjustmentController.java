package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.service.TariffAdjustmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.tariffadjustment.api.TariffAdjustmentApi;
import teleconnect.tariffadjustment.model.TariffAdjustmentDTO;

@RestController
@RequiredArgsConstructor
public class TariffAdjustmentController implements TariffAdjustmentApi {

    private final TariffAdjustmentService tariffAdjustmentService;

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

    private boolean hasEmployeeRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }

}
