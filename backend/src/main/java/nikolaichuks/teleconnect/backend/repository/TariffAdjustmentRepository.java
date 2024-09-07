package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.TariffAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TariffAdjustmentRepository extends JpaRepository<TariffAdjustment, Integer> {
    @Query("SELECT tariff_adjustment FROM TariffAdjustment tariff_adjustment JOIN User u ON u.tariffAdjustment.id = tariff_adjustment.id WHERE u.id = :userId")
    Optional<TariffAdjustment> findByUserId(@Param("userId") Integer userId);
}
