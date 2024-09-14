package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.TariffAdjustment;
import nikolaichuks.teleconnect.backend.repository.TariffAdjustmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import teleconnect.tariffadjustment.model.TariffAdjustmentDTO;

/**
 * Tariff adjustment service
 */
@Service
@RequiredArgsConstructor
public class TariffAdjustmentService {

    private final MapperUtil mapper;
    private final TariffAdjustmentRepository tariffAdjustmentRepository;

    public TariffAdjustmentDTO updateAdjustment(TariffAdjustmentDTO adjustmentDTO) {
        if (adjustmentDTO.getId() != null) {
            return tariffAdjustmentRepository.findById(adjustmentDTO.getId())
                    .map(adjustment -> {
                        adjustment.setDiscountPercentage(adjustmentDTO.getDiscountPercentage());
                        adjustment.setAdjustedCallMinutes(adjustmentDTO.getAdjustedCallMinutes());
                        adjustment.setAdjustedSmsLimit(adjustmentDTO.getAdjustedSmsLimit());
                        adjustment.setAdjustedDataLimit(adjustmentDTO.getAdjustedDataLimit());
                        return tariffAdjustmentRepository.save(adjustment);
                    })
                    .map(mapper::mapTariffAdjustmentToTariffAdjustmentDTO)
                    .orElseThrow(() -> new CustomRestException("Adjustment not found", HttpStatus.NOT_FOUND));
        } else {
            TariffAdjustment newAdjustment = mapper.mapTariffAdjustmentDTOToTariffAdjustment(adjustmentDTO);
            return mapper.mapTariffAdjustmentToTariffAdjustmentDTO(tariffAdjustmentRepository.save(newAdjustment));
        }
    }

    public TariffAdjustmentDTO getTariffAdjustment(Integer userId) {
        return tariffAdjustmentRepository.findByUserId(userId)
                .map(mapper::mapTariffAdjustmentToTariffAdjustmentDTO)
                .orElse(null);
    }

    public void deleteAdjustment(Integer id) {
        tariffAdjustmentRepository.deleteById(id);
    }

}
