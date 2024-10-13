package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.auth.TokenBlacklist;
import nikolaichuks.teleconnect.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {
    TokenBlacklist findByUser(User user);

    void deleteByExpiryDateBefore(LocalDateTime date);

    boolean existsByToken(String token);
}