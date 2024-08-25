package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByTariff_Id(Integer tariffId);
}
