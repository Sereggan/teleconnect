package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.statistics.api.StatisticsApi;
import teleconnect.statistics.model.TariffAdjustmentCountResponse;
import teleconnect.statistics.model.TariffAgeGroupStatisticsResponse;
import teleconnect.statistics.model.UserByTariffResponse;
import teleconnect.statistics.model.UsersWithoutTariffResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StatisticsController implements StatisticsApi {

    private final StatisticsService statisticsService;

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<List<TariffAdjustmentCountResponse>> getTariffAdjustmentCount() {
        return ResponseEntity.ok(statisticsService.getTariffAdjustmentCount());
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<List<TariffAgeGroupStatisticsResponse>> getTariffAgeGroupStatistics() {
        return ResponseEntity.ok(statisticsService.getTariffAgeStatistics());
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<List<UserByTariffResponse>> getUsersByTariff() {
        return ResponseEntity.ok(statisticsService.getUsersByTariff());
    }

    /*
     // {@inheritDoc}
     */
    @Override
    public ResponseEntity<UsersWithoutTariffResponse> getUsersWithoutTariff() {
        return ResponseEntity.ok(statisticsService.getUsersWithoutTariff());
    }
}
