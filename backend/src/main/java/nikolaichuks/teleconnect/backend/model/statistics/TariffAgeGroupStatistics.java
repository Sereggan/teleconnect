package nikolaichuks.teleconnect.backend.model.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TariffAgeGroupStatistics {

    private String tariffName;
    private String ageGroup;
    private Long userCount;

}