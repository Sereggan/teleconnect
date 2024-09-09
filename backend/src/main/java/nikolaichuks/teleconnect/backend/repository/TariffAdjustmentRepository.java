package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.TariffAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TariffAdjustmentRepository extends JpaRepository<TariffAdjustment, Integer> {

    Optional<TariffAdjustment> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT t.name, COUNT(ta) FROM TariffAdjustment ta JOIN ta.tariff t GROUP BY t.name")
    List<Object[]> countAdjustmentsByTariff();

    @Query("SELECT t.name, MAX(ta.discountPercentage) FROM TariffAdjustment ta JOIN ta.tariff t ORDER BY ta.discountPercentage DESC")
    List<Object[]> findMostDiscountedTariff();
}
