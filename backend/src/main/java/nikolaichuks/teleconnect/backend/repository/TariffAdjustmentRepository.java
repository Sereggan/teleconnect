package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.statistics.MostDiscountedTariff;
import nikolaichuks.teleconnect.backend.model.tariff.TariffAdjustment;
import nikolaichuks.teleconnect.backend.model.statistics.TariffAdjustmentsCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TariffAdjustmentRepository extends JpaRepository<TariffAdjustment, Integer> {

    Optional<TariffAdjustment> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT new nikolaichuks.teleconnect.backend.model.statistics.TariffAdjustmentsCount(t.name, COUNT(ta)) FROM TariffAdjustment ta JOIN ta.tariff t GROUP BY t.name")
    List<TariffAdjustmentsCount> countAdjustmentsByTariff();

    @Query("SELECT new nikolaichuks.teleconnect.backend.model.statistics.MostDiscountedTariff(t.name, MAX(ta.discountPercentage)) FROM TariffAdjustment ta JOIN ta.tariff t GROUP BY t.name ORDER BY ta.discountPercentage DESC")
    List<MostDiscountedTariff> findMostDiscountedTariff();
}
