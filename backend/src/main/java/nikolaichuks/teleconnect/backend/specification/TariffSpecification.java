package nikolaichuks.teleconnect.backend.specification;

import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import nikolaichuks.teleconnect.backend.model.Tariff;
import nikolaichuks.teleconnect.backend.model.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class TariffSpecification {

    public Specification<Tariff> getTariffSpecification(Double priceMin, Double priceMax, Integer dataLimitMin,
                                                        Integer dataLimitMax, Integer callMinutesMin, Integer callMinutesMax,
                                                        Integer smsLimitMin, Integer smsLimitMax, Boolean isActive, Boolean isUsed) {
        Specification<Tariff> spec = Specification.where(null);
        if (priceMin != null || priceMax != null) {
            spec = spec.and(hasPriceBetween(priceMin, priceMax));
        }

        if (dataLimitMin != null || dataLimitMax != null) {
            spec = spec.and(hasDataLimitBetween(dataLimitMin, dataLimitMax));
        }

        if (callMinutesMin != null || callMinutesMax != null) {
            spec = spec.and(hasCallMinutesBetween(callMinutesMin, callMinutesMax));
        }

        if (smsLimitMin != null || smsLimitMax != null) {
            spec = spec.and(hasSmsLimitBetween(smsLimitMin, smsLimitMax));
        }

        if (isActive != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isActive"), isActive));
        }

        if (isUsed != null) {
            spec = spec.and((root, query, cb) -> {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<User> userRoot = subquery.from(User.class);

                subquery.select(cb.count(userRoot.get("id")))
                        .where(cb.equal(userRoot.get("tariff"), root));

                return isUsed ? cb.greaterThan(subquery, 0L) : cb.equal(subquery, 0L);
            });
        }
        return spec;
    }

    private Specification<Tariff> hasPriceBetween(Double minPrice, Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice != null && maxPrice != null) {
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            } else if (maxPrice != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            } else {
                return criteriaBuilder.conjunction();
            }
        };
    }

    private Specification<Tariff> hasDataLimitBetween(Integer minData, Integer maxData) {
        return (root, query, criteriaBuilder) -> {
            if (minData != null && maxData != null) {
                return criteriaBuilder.between(root.get("dataLimit"), minData, maxData);
            } else if (minData != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("dataLimit"), minData);
            } else if (maxData != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("dataLimit"), maxData);
            } else {
                return criteriaBuilder.conjunction();
            }
        };
    }

    private Specification<Tariff> hasCallMinutesBetween(Integer min, Integer max) {
        return (root, query, criteriaBuilder) -> {
            if (min != null && max != null) {
                return criteriaBuilder.between(root.get("callMinutes"), min, max);
            } else if (min != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("callMinutes"), min);
            } else if (max != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("callMinutes"), max);
            } else {
                return criteriaBuilder.conjunction();
            }
        };
    }

    private Specification<Tariff> hasSmsLimitBetween(Integer min, Integer max) {
        return (root, query, criteriaBuilder) -> {
            if (min != null && max != null) {
                return criteriaBuilder.between(root.get("smsLimit"), min, max);
            } else if (min != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("smsLimit"), min);
            } else if (max != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("smsLimit"), max);
            } else {
                return criteriaBuilder.conjunction();
            }
        };
    }
}
