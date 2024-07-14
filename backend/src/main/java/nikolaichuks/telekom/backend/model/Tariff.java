package nikolaichuks.telekom.backend.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Tariff {

    private int id;
    private String name;
    private Double price;
    private String description;
    private Boolean isActive;
}
