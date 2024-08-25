package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByTariff_Id(Integer tariffId);

    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.email = :userName OR u.phoneNumber = :userName")
    Optional<User> findByEmailOrPhoneNumber(@Param("userName") String userName);

}
