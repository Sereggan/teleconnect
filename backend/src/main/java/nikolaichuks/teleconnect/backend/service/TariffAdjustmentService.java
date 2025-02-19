package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.tariff.TariffAdjustment;
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
                        adjustment.setPrice(adjustmentDTO.getPrice());
                        adjustment.setCallMinutes(adjustmentDTO.getCallMinutes());
                        adjustment.setSmsLimit(adjustmentDTO.getSmsLimit());
                        adjustment.setDataLimit(adjustmentDTO.getDataLimit());
                        return tariffAdjustmentRepository.save(mapper.mapTariffAdjustmentDtoToTariffAdjustment(adjustmentDTO, adjustment));
                    })
                    .map(mapper::mapTariffAdjustmentToTariffAdjustmentDto)
                    .orElseThrow(() -> new CustomRestException("Adjustment not found", HttpStatus.NOT_FOUND));
        } else {
            TariffAdjustment newAdjustment = mapper.mapTariffAdjustmentDtoToTariffAdjustment(adjustmentDTO);
            return mapper.mapTariffAdjustmentToTariffAdjustmentDto(tariffAdjustmentRepository.save(newAdjustment));
        }
    }

    public TariffAdjustmentDTO getTariffAdjustment(Integer userId) {
        return tariffAdjustmentRepository.findByUserId(userId)
                .map(mapper::mapTariffAdjustmentToTariffAdjustmentDto)
                .orElse(null);
    }

    public void deleteAdjustment(Integer id) {
        tariffAdjustmentRepository.deleteById(id);
    }

}
