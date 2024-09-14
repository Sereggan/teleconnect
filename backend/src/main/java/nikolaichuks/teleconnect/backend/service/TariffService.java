package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.TariffSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import teleconnect.tariff.model.PaginatedTariffResponse;
import teleconnect.tariff.model.TariffDTO;

import java.util.List;

/**
 * Tariff service
 */
@Service
@RequiredArgsConstructor
public class TariffService {

    private final MapperUtil mapper;
    private final UserRepository userRepository;
    private final TariffRepository tariffRepository;
    private final TariffSpecification tariffSpecification;

    public TariffDTO createTariff(TariffDTO tariffDTO) {
        Tariff tariff = mapper.mapTariffDTOToTariff(tariffDTO);
        return mapper.mapTariffToTariffDTO(tariffRepository.save(tariff));
    }

    public PaginatedTariffResponse getAllTariffs(Double priceMin, Double priceMax, Integer dataLimitMin, Integer dataLimitMax,
                                                 Integer callMinutesMin, Integer callMinutesMax, Integer smsLimitMin, Integer smsLimitMax,
                                                 Boolean isActive, Boolean isUsed, Integer limit, Integer offset) {
        Specification<Tariff> specification = tariffSpecification.getTariffSpecification(priceMin, priceMax, dataLimitMin, dataLimitMax,
                callMinutesMin, callMinutesMax, smsLimitMin, smsLimitMax, isActive, isUsed);

        PageRequest page = PageRequest.of(offset, limit, Sort.Direction.ASC, "tariff_id");
        Page<Tariff> tariffsPage = tariffRepository.findAll(specification, page);

        List<TariffDTO> tariffs = tariffsPage.getContent().stream()
                .map(mapper::mapTariffToTariffDTO)
                .peek(tariffDTO -> tariffDTO.setIsUsed(userRepository.existsByTariff_Id(tariffDTO.getId())))
                .toList();

        return getPaginatedTariffResponse(offset, tariffs, tariffsPage);
    }

    public TariffDTO updateTariff(TariffDTO tariffDTO) {
        Tariff existingTariff = tariffRepository.findById(tariffDTO.getId())
                .orElseThrow(() -> new CustomRestException("Tariff not found", HttpStatus.NOT_FOUND));

        Tariff updatedTariff = mapper.mapTariffToTariffDTO(tariffDTO, existingTariff);

        var mappedTariff = mapper.mapTariffToTariffDTO(tariffRepository.save(updatedTariff));
        mappedTariff.setIsUsed(userRepository.existsByTariff_Id(mappedTariff.getId()));
        return mappedTariff;
    }


    public TariffDTO getTariffById(Integer id) {
        return tariffRepository.findById(id)
                .map(mapper::mapTariffToTariffDTO)
                .map(tariffDTO -> {
                    tariffDTO.setIsUsed(userRepository.existsByTariff_Id(tariffDTO.getId()));
                    return tariffDTO;
                })
                .orElseThrow(() -> new CustomRestException("Tariff not found", HttpStatus.NOT_FOUND));
    }

    public TariffDTO getTariffByUserId(Integer userId) {
        return tariffRepository.findByUserId(userId)
                .map(mapper::mapTariffToTariffDTO)
                .map(tariffDTO -> {
                    tariffDTO.setIsUsed(true);
                    return tariffDTO;
                })
                .orElse(null);
    }

    public void deleteTariff(Integer id) {
        if (!userRepository.existsByTariff_Id(id)) {
            tariffRepository.deleteById(id);
        } else {
            throw new CustomRestException("Tariff is used.", HttpStatus.CONFLICT);
        }
    }

    private static PaginatedTariffResponse getPaginatedTariffResponse(Integer offset, List<TariffDTO> tariffs, Page<Tariff> tariffsPage) {
        var response = new PaginatedTariffResponse();
        response.setTariffs(tariffs);
        response.setTotalItems((int) tariffsPage.getTotalElements());
        response.setTotalPages(tariffsPage.getTotalPages());
        response.setCurrentPage(offset);
        response.setItemsOnPage(tariffs.size());
        return response;
    }
}
