package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.statistics.TariffAdjustmentsCount;
import nikolaichuks.teleconnect.backend.model.tariff.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TariffRepository extends JpaRepository<Tariff, Integer>, JpaSpecificationExecutor<Tariff> {

    @Query("SELECT tariff FROM Tariff tariff JOIN User user ON user.tariff.id = tariff.id WHERE user.id = :userId")
    Optional<Tariff> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT new nikolaichuks.teleconnect.backend.model.statistics.TariffAdjustmentsCount(t.name, COUNT(ta.id)) " +
            "FROM Tariff t " +
            "JOIN TariffAdjustment ta ON ta.tariff.id = t.id " +
            "GROUP BY t.name")
    List<TariffAdjustmentsCount> countTariffAdjustmentByTariff();

}
