package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.TariffAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TariffAdjustmentRepository extends JpaRepository<TariffAdjustment, Integer> {
    Optional<TariffAdjustment> findByUserId(Integer userId);
}
