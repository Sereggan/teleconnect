package nikolaichuks.teleconnect.backend.model.tariff;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import nikolaichuks.teleconnect.backend.model.user.User;

/**
 * TariffAdjustment entity
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Table(name = "tariff_adjustment")
public class TariffAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer adjustedDataLimit;
    private Integer adjustedCallMinutes;
    private Integer adjustedSmsLimit;
    private Double discountPercentage;

    @ManyToOne
    @JoinColumn(name = "tariff_id", nullable = false)
    private Tariff tariff;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
