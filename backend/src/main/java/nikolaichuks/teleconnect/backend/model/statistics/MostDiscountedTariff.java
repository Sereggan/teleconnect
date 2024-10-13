package nikolaichuks.teleconnect.backend.model.statistics;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MostDiscountedTariff {

    private String tariffName;
    private Float maxDiscountPercentage;

    public MostDiscountedTariff() {
    }

    public MostDiscountedTariff(String tariffName, Float maxDiscountPercentage) {
        this.tariffName = tariffName;
        this.maxDiscountPercentage = maxDiscountPercentage;
    }
}