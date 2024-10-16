package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.tariff.TariffAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TariffAdjustmentRepository extends JpaRepository<TariffAdjustment, Integer> {

    Optional<TariffAdjustment> findByUserId(@Param("userId") Integer userId);
}
