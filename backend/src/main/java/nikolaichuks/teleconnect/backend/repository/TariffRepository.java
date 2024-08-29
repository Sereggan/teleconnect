package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TariffRepository extends JpaRepository<Tariff, Integer>, JpaSpecificationExecutor<Tariff> {
}
