package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.model.statistics.UsersByTariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {

    boolean existsByTariff_Id(Integer tariffId);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :userName OR u.phoneNumber = :userName")
    Optional<User> findByEmailOrPhoneNumber(@Param("userName") String userName);

    @Query("SELECT new nikolaichuks.teleconnect.backend.model.statistics.UsersByTariff(u.tariff.name, COUNT(u)) FROM User u WHERE u.tariff IS NOT NULL GROUP BY u.tariff.name")
    List<UsersByTariff> countUsersByTariff();

    Long countByTariffIsNull();
}
