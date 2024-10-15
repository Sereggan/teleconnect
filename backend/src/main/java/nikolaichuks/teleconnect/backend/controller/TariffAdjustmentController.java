package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.model.user.UserRole;
import nikolaichuks.teleconnect.backend.service.TariffAdjustmentService;
import nikolaichuks.teleconnect.backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.tariffadjustment.api.TariffAdjustmentApi;
import teleconnect.tariffadjustment.model.TariffAdjustmentDTO;

@RestController
@RequiredArgsConstructor
public class TariffAdjustmentController implements TariffAdjustmentApi {

    private final AuthUtil authUtil;
    private final TariffAdjustmentService tariffAdjustmentService;

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TariffAdjustmentDTO> getTariffAdjustmentByUserId(Integer id) {
        if (authUtil.hasEmployeeRoleOrEqualToUserId(id.toString())) {
            return ResponseEntity.ok(tariffAdjustmentService.getTariffAdjustment(id));
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TariffAdjustmentDTO> updateTariffAdjustment(TariffAdjustmentDTO tariffAdjustmentDTO) {
        return ResponseEntity.ok(tariffAdjustmentService.updateAdjustment(tariffAdjustmentDTO));
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<Void> deleteTariffAdjustment(Integer id) {
        tariffAdjustmentService.deleteAdjustment(id);
        return ResponseEntity.ok().build();
    }

    private boolean hasEmployeeRole(User currentUser) {
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }
}
