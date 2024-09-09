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

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final UserRepository userRepository;
    private final TariffAdjustmentRepository tariffAdjustmentRepository;

    public List<UserByTariffResponse> getUsersByTariff() {
        return userRepository.countUsersByTariff().stream()
                .map(obj -> {
                    UserByTariffResponse response = new UserByTariffResponse();
                    response.setTariffName((String) obj[0]);
                    response.setUserCount((Long) obj[1]);
                    return response;
                })
                .collect(Collectors.toList());
    }

    public List<AdjustmentByTariffResponse> getAdjustmentsByTariff() {
        return tariffAdjustmentRepository.countAdjustmentsByTariff().stream()
                .map(obj -> {
                    AdjustmentByTariffResponse response = new AdjustmentByTariffResponse();
                    response.setTariffName((String) obj[0]);
                    response.setAdjustmentCount((Long) obj[1]);
                    return response;
                })
                .collect(Collectors.toList());
    }

    public MostDiscountedTariffResponse getMostDiscountedTariff() {
        return tariffAdjustmentRepository.findMostDiscountedTariff().stream()
                .findFirst()
                .map(obj -> {
                    MostDiscountedTariffResponse response = new MostDiscountedTariffResponse();
                    response.setTariffName((String) obj[0]);
                    response.setAverageDiscount((Float) obj[1]);
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
