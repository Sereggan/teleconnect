package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.auth.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByCode(String token);
}