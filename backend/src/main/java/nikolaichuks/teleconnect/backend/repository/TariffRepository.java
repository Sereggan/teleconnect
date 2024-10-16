package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.statistics.TariffAdjustmentsCount;
import nikolaichuks.teleconnect.backend.model.statistics.TariffAgeGroupStatistics;
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

    @Query(value = "SELECT t.name AS tariffName, " +
            "CASE " +
            "WHEN EXTRACT(YEAR FROM AGE(u.birth_date)) < 18 THEN 'Under 18' " +
            "WHEN EXTRACT(YEAR FROM AGE(u.birth_date)) BETWEEN 18 AND 25 THEN '18-25' " +
            "WHEN EXTRACT(YEAR FROM AGE(u.birth_date)) BETWEEN 26 AND 35 THEN '26-35' " +
            "WHEN EXTRACT(YEAR FROM AGE(u.birth_date)) BETWEEN 36 AND 50 THEN '36-50' " +
            "ELSE 'Above 50' END AS ageGroup, " +
            "COUNT(u.id) AS userCount " +
            "FROM users u " +
            "JOIN tariff t ON u.tariff_id = t.id " +
            "GROUP BY t.name, ageGroup",
            nativeQuery = true)
    List<TariffAgeGroupStatistics> getTariffAgeGroupStatistics();
}
