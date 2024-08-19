package nikolaichuks.teleconnect.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

/**
 * Tariff entity
 */
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Data
@Entity
@Builder
@Table(name = "tariff")
public class Tariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Double price;
    private String description;
    private Boolean isActive;
    private Integer dataLimit;
    private Integer callMinutes;
    private Integer smsLimit;
    private LocalDate validFrom;
    private LocalDate validTo;
}
