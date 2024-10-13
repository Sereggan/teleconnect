package nikolaichuks.teleconnect.backend.model.statistics;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsersByTariff {

    private String tariffName;
    private Long userCount;

    public UsersByTariff() {
    }

    public UsersByTariff(String tariffName, Long userCount) {
        this.tariffName = tariffName;
        this.userCount = userCount;
    }

}
