package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.UserRole;
import nikolaichuks.teleconnect.backend.model.UserRoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
    Optional<UserRole> findByName(UserRoleName name);
}
