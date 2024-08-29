package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.repository.TokenBlacklistRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class TokenCleanUpSchedulerService {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupExpiredTokens() {
        tokenBlacklistRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }

}
