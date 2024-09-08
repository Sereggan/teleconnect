package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TariffRepository extends JpaRepository<Tariff, Integer>, JpaSpecificationExecutor<Tariff> {

    @Query("SELECT tariff FROM Tariff tariff JOIN User user ON user.tariff.id = tariff.id WHERE user.id = :userId")
    Optional<Tariff> findByUserId(@Param("userId") Integer userId);
}
