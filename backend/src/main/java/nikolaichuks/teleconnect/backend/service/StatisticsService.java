package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.repository.TariffAdjustmentRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import teleconnect.statistics.model.AdjustmentByTariffResponse;
import teleconnect.statistics.model.MostDiscountedTariffResponse;
import teleconnect.statistics.model.UserByTariffResponse;
import teleconnect.statistics.model.UsersWithoutTariffResponse;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Statistics service
 */
@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final UserRepository userRepository;
    private final TariffAdjustmentRepository tariffAdjustmentRepository;

    public List<UserByTariffResponse> getUsersByTariff() {
        return userRepository.countUsersByTariff().stream()
                .map(res -> {
                    UserByTariffResponse response = new UserByTariffResponse();
                    response.setTariffName(res.getTariffName());
                    response.setUserCount(res.getUserCount());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public List<AdjustmentByTariffResponse> getAdjustmentsByTariff() {
        return tariffAdjustmentRepository.countAdjustmentsByTariff().stream()
                .map(ta -> {
                    AdjustmentByTariffResponse response = new AdjustmentByTariffResponse();
                    response.setTariffName(ta.getTariffName());
                    response.setAdjustmentCount(ta.getAdjustmentCount());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public MostDiscountedTariffResponse getMostDiscountedTariff() {
        return tariffAdjustmentRepository.findMostDiscountedTariff().stream()
                .findFirst()
                .map(tariff -> {
                    MostDiscountedTariffResponse response = new MostDiscountedTariffResponse();
                    response.setTariffName(tariff.getTariffName());
                    response.setAverageDiscount(tariff.getMaxDiscountPercentage());
                    return response;
                })
                .orElse(null);
    }


    public UsersWithoutTariffResponse getUsersWithoutTariff() {
        var user = new UsersWithoutTariffResponse();
        user.setCount(userRepository.countByTariffIsNull());
        return user;
    }
}
