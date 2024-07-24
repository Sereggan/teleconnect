package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public interface TariffRepository extends JpaRepository<Tariff, Integer> {

}
