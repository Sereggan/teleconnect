package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.TariffAdjustment;
import nikolaichuks.teleconnect.backend.repository.TariffAdjustmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import teleconnect.tariffadjustment.model.TariffAdjustmentDTO;

@Service
@RequiredArgsConstructor
public class TariffAdjustmentService {

    private final TariffAdjustmentRepository tariffAdjustmentRepository;
    private final MapperUtil mapper;

    public TariffAdjustmentDTO createAdjustment(TariffAdjustmentDTO adjustmentDTO) {
        TariffAdjustment adjustment = mapper.mapTariffAdjustmentDTOToTariffAdjustment(adjustmentDTO);
        return mapper.mapTariffAdjustmentToTariffAdjustmentDTO(tariffAdjustmentRepository.save(adjustment));
    }

    public TariffAdjustmentDTO updateAdjustment(TariffAdjustmentDTO adjustmentDTO) {
        TariffAdjustment adjustment = tariffAdjustmentRepository.findById(adjustmentDTO.getId())
                .orElseThrow(() -> new CustomRestException("Tariff adjustment not found", HttpStatus.NOT_FOUND));

        adjustment.setAdjustedDataLimit(adjustmentDTO.getAdjustedDataLimit())
                .setAdjustedCallMinutes(adjustmentDTO.getAdjustedCallMinutes())
                .setAdjustedSmsLimit(adjustmentDTO.getAdjustedSmsLimit())
                .setDiscountPercentage(adjustmentDTO.getDiscountPercentage());

        return mapper.mapTariffAdjustmentToTariffAdjustmentDTO(tariffAdjustmentRepository.save(adjustment));
    }

    public void deleteAdjustment(Integer id) {
        tariffAdjustmentRepository.deleteById(id);
    }

}
