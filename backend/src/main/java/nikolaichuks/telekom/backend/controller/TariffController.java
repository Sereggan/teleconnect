package nikolaichuks.telekom.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.telekom.backend.model.Tariff;
import nikolaichuks.telekom.backend.repository.TariffRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController()
@RequestMapping("/tariff")
public class TariffController {

    @GetMapping("/{id}")
    public Tariff getTariff(@PathVariable Integer id) {
        return Tariff.builder()
                .id(id)
                .name("First tariff")
                .price(123.0)
                .build();
    }


    @GetMapping("/listTariffs")
    public List<Tariff> getTariffs() {
        return List.of(Tariff.builder()
                .id(1)
                .name("First tariff")
                .price(123.0)
                .build());
    }

    @PostMapping("")
    public Tariff createTariff(@RequestBody Tariff tariff) {
        return tariff;
    }

    @PatchMapping("")
    public Tariff updateTariff(@RequestBody Tariff tariff) {
        return tariff;
    }
}
