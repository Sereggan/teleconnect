package nikolaichuks.teleconnect.backend.model.statistics;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TariffAdjustmentsCount {

    private String tariffName;
    private Long adjustmentCount;

    public TariffAdjustmentsCount() {
    }

    public TariffAdjustmentsCount(String tariffName, Long adjustmentCount) {
        this.tariffName = tariffName;
        this.adjustmentCount = adjustmentCount;
    }
}