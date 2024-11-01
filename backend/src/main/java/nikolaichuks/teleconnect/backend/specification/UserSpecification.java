package nikolaichuks.teleconnect.backend.specification;

import nikolaichuks.teleconnect.backend.model.user.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class UserSpecification {

    private static final String FIELD_PHONE_NUMBER = "phoneNumber";
    private static final String FIELD_EMAIL = "email";
    private static final String FIELD_NAME = "name";
    private static final String FIELD_familyName = "familyName";
    private static final String FIELD_ROLE = "role";
    private static final String FIELD_TARIFF = "tariff";
    private static final String FIELD_ID = "id";

    public Specification<User> getUserSpecification(String phoneNumber, String email, String name, String familyName, String role, Integer tariffId) {
        Specification<User> spec = Specification.where(null);

        if (phoneNumber != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get(FIELD_PHONE_NUMBER), phoneNumber + "%")
            );
        }

        if (email != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get(FIELD_EMAIL), email + "%")
            );
        }

        if (name != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get(FIELD_NAME)), name + "%")
            );
        }

        if (familyName != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get(FIELD_familyName)), familyName + "%")
            );
        }

        if (role != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(FIELD_ROLE), role)
            );
        }

        if (tariffId != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(FIELD_TARIFF).get(FIELD_ID), tariffId)
            );
        }

        return spec;
    }
}
