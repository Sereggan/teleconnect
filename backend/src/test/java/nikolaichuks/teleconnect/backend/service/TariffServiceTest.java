package nikolaichuks.teleconnect.backend.service;

import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.specification.TariffSpecification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import teleconnect.tariff.model.PaginatedTariffResponse;
import teleconnect.tariff.model.TariffDTO;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TariffServiceTest {

    @Mock
    MapperUtil mapperUtil;
    @Mock
    UserRepository userRepository;
    @Mock
    TariffRepository tariffRepository;
    @Mock
    TariffSpecification tariffSpecification;

    private static final Integer TARIFF_ID = 1;
    private static final Integer USER_ID = 2;

    private static final String TARIFF_NOT_FOUND_EXCEPTION_MESSAGE = "Tariff not found";
    private static final String TARIFF_IS_USED_EXCEPTION = "Tariff is used.";

    @InjectMocks
    private TariffService tariffService;

    @Test
    void shouldCreateTariff() {
        TariffDTO newTariff = mock(TariffDTO.class);
        Tariff mappedTariff = mock(Tariff.class);
        Tariff savedTariff = mock(Tariff.class);
        TariffDTO savedTariffDTO = mock(TariffDTO.class);

        when(mapperUtil.mapTariffDtoToTariff(any())).thenReturn(mappedTariff);
        when(tariffRepository.save(any())).thenReturn(savedTariff);
        when(mapperUtil.mapTariffToTariffDto(any())).thenReturn(savedTariffDTO);

        var result = tariffService.createTariff(newTariff);

        verify(mapperUtil).mapTariffDtoToTariff(newTariff);
        verify(mapperUtil).mapTariffDtoToTariff(newTariff);
        verify(tariffRepository).save(mappedTariff);
        verify(mapperUtil).mapTariffToTariffDto(savedTariff);
        assertThat(result).isEqualTo(savedTariffDTO);
    }

    @Test
    @SuppressWarnings("unchecked")
    void shouldGetAllTariffs() {
        Double priceMin = 10.0;
        Double priceMax = 100.0;
        Integer dataLimitMin = 1;
        Integer dataLimitMax = 10;
        Integer callMinutesMin = 100;
        Integer callMinutesMax = 1000;
        Integer smsLimitMin = 50;
        Integer smsLimitMax = 500;
        Boolean isActive = true;
        Boolean isUsed = false;
        Integer limit = 10;
        Integer offset = 0;

        Boolean existsByTariffId = false;

        Specification<Tariff> specification = mock(Specification.class);
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.Direction.ASC, "tariff_id");
        Tariff tariff = mock(Tariff.class);
        TariffDTO tariffDTO = mock(TariffDTO.class);
        List<Tariff> tariffList = List.of(tariff);
        Page<Tariff> tariffsPage = new PageImpl<>(tariffList, pageRequest, 1);

        when(tariffSpecification.getTariffSpecification(any(), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(specification);
        when(tariffRepository.findAll(specification, pageRequest)).thenReturn(tariffsPage);
        when(mapperUtil.mapTariffToTariffDto(any())).thenReturn(tariffDTO);
        when(userRepository.existsByTariff_Id(any())).thenReturn(existsByTariffId);

        PaginatedTariffResponse result = tariffService.getAllTariffs(priceMin, priceMax, dataLimitMin, dataLimitMax,
                callMinutesMin, callMinutesMax, smsLimitMin, smsLimitMax, isActive, isUsed, limit, offset);

        verify(tariffSpecification).getTariffSpecification(priceMin, priceMax, dataLimitMin, dataLimitMax,
                callMinutesMin, callMinutesMax, smsLimitMin, smsLimitMax, isActive, isUsed);
        verify(tariffRepository).findAll(specification, pageRequest);
        verify(mapperUtil).mapTariffToTariffDto(tariff);
        verify(userRepository).existsByTariff_Id(tariffDTO.getId());

        assertThat(result).isNotNull();
        assertThat(result.getTariffs()).contains(tariffDTO);
        assertThat(result.getTotalItems()).isEqualTo(1);
        assertThat(result.getTotalPages()).isEqualTo(1);
        assertThat(result.getCurrentPage()).isEqualTo(offset);
        assertThat(result.getItemsOnPage()).isEqualTo(1);
    }

    @Test
    void shouldUpdateTariff() {
        var tariffToUpdate = mock(TariffDTO.class);
        var existingTariff = mock(Tariff.class);
        var mappedTariff = mock(Tariff.class);
        var savedTariff = mock(Tariff.class);
        var updatedTariff = mock(TariffDTO.class);

        when(tariffToUpdate.getId()).thenReturn(TARIFF_ID);
        when(tariffRepository.findById(any())).thenReturn(Optional.of(existingTariff));
        when(mapperUtil.mapTariffToTariffDto(tariffToUpdate, existingTariff)).thenReturn(mappedTariff);
        when(tariffRepository.save(any())).thenReturn(savedTariff);
        when(mapperUtil.mapTariffToTariffDto(any())).thenReturn(updatedTariff);
        when(updatedTariff.getId()).thenReturn(TARIFF_ID);
        when(userRepository.existsByTariff_Id(any())).thenReturn(true);

        var result = tariffService.updateTariff(tariffToUpdate);

        verify(tariffRepository).findById(TARIFF_ID);
        verify(mapperUtil).mapTariffToTariffDto(tariffToUpdate, existingTariff);
        verify(tariffRepository).save(mappedTariff);
        verify(mapperUtil).mapTariffToTariffDto(savedTariff);
        verify(userRepository).existsByTariff_Id(TARIFF_ID);
        assertThat(result).isEqualTo(updatedTariff);
    }

    @Test
    void shouldGetTariffById() {
        var existingTariff = mock(Tariff.class);
        var tariffDTO = mock(TariffDTO.class);
        var isUsed = true;
        when(tariffRepository.findById(any())).thenReturn(Optional.of(existingTariff));
        when(mapperUtil.mapTariffToTariffDto(existingTariff)).thenReturn(tariffDTO);
        when(tariffDTO.getId()).thenReturn(TARIFF_ID);
        when(userRepository.existsByTariff_Id(any())).thenReturn(isUsed);

        var result = tariffService.getTariffById(TARIFF_ID);

        verify(tariffRepository).findById(TARIFF_ID);
        verify(mapperUtil).mapTariffToTariffDto(existingTariff);
        verify(userRepository).existsByTariff_Id(TARIFF_ID);
        verify(tariffDTO).setIsUsed(isUsed);
        assertThat(result).isEqualTo(tariffDTO);
    }

    @Test
    void shouldGetTariffByIdAndThrowException() {
        when(tariffRepository.findById(TARIFF_ID)).thenReturn(Optional.empty());

        CustomRestException exception = assertThrows(CustomRestException.class, () -> tariffService.getTariffById(TARIFF_ID));

        verify(tariffRepository).findById(TARIFF_ID);
        assertThat(exception.getMessage()).isEqualTo(TARIFF_NOT_FOUND_EXCEPTION_MESSAGE);
        assertThat(exception.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldGetTariffByUserId() {
        var existingTariff = mock(Tariff.class);
        var tariffDTO = mock(TariffDTO.class);
        var isUsed = true;

        when(tariffRepository.findByUserId(any())).thenReturn(Optional.of(existingTariff));
        when(mapperUtil.mapTariffToTariffDto(any())).thenReturn(tariffDTO);

        var result = tariffService.getTariffByUserId(USER_ID);

        verify(tariffRepository).findByUserId(USER_ID);
        verify(mapperUtil).mapTariffToTariffDto(existingTariff);
        verify(tariffDTO).setIsUsed(isUsed);
        assertThat(result).isEqualTo(tariffDTO);
    }

    @Test
    void shouldReturnNullWhenTariffNotFoundByUserId() {

        when(tariffRepository.findByUserId(any())).thenReturn(Optional.empty());

        var result = tariffService.getTariffByUserId(USER_ID);

        verify(tariffRepository).findByUserId(USER_ID);
        assertThat(result).isNull();
    }

    @Test
    void shouldDeleteTariff() {
        when(userRepository.existsByTariff_Id(any())).thenReturn(false);

        tariffService.deleteTariff(TARIFF_ID);

        verify(userRepository).existsByTariff_Id(TARIFF_ID);
        verify(tariffRepository).deleteById(TARIFF_ID);
    }

    @Test
    void shouldThrowExceptionWhenTariffIsUsed() {
        when(userRepository.existsByTariff_Id(any())).thenReturn(true);

        CustomRestException exception = assertThrows(CustomRestException.class, () -> tariffService.deleteTariff(TARIFF_ID));

        verify(userRepository).existsByTariff_Id(TARIFF_ID);
        verify(tariffRepository, never()).deleteById(TARIFF_ID);
        assertThat(exception.getMessage()).isEqualTo(TARIFF_IS_USED_EXCEPTION);
        assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
    }
}
