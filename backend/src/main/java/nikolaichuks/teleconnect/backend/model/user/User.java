package nikolaichuks.teleconnect.backend.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import nikolaichuks.teleconnect.backend.model.tariff.Tariff;
import nikolaichuks.teleconnect.backend.model.tariff.TariffAdjustment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

/**
 * User entity
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Accessors(chain = true)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(min = 10, max = 15)
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10,15}$")
    private String phoneNumber;

    private String password;

    @Email
    private String email;

    private String name;

    private String familyName;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @ManyToOne
    @JoinColumn(name = "tariff_id")
    private Tariff tariff;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private TariffAdjustment tariffAdjustment;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(role);
    }

    @Override
    public String getUsername() {
        return email;
    }

}
