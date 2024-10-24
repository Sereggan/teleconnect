package nikolaichuks.teleconnect.backend.repository;

import jakarta.transaction.Transactional;
import nikolaichuks.teleconnect.backend.model.tariff.TariffAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TariffAdjustmentRepository extends JpaRepository<TariffAdjustment, Integer> {

    Optional<TariffAdjustment> findByUserId(@Param("userId") Integer userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM TariffAdjustment t WHERE t.id = :id")
    void deleteById(@Param("id") Integer id);

}
