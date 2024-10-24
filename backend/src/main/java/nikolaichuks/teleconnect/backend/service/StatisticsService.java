package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.repository.TariffRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import teleconnect.statistics.model.TariffAdjustmentCountResponse;
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
    private final TariffRepository tariffRepository;

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

    public List<TariffAdjustmentCountResponse> getTariffAdjustmentCount() {
        return tariffRepository.countTariffAdjustmentByTariff().stream()
                .map(ta -> {
                    TariffAdjustmentCountResponse response = new TariffAdjustmentCountResponse();
                    response.setTariffName(ta.getTariffName());
                    response.setAdjustmentCount(ta.getAdjustmentCount());
                    return response;
                })
                .collect(Collectors.toList());
    }


    public UsersWithoutTariffResponse getUsersWithoutTariff() {
        var user = new UsersWithoutTariffResponse();
        user.setCount(userRepository.countByTariffIsNull());
        return user;
    }
}
