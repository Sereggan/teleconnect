package nikolaichuks.teleconnect.backend.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    ROLE_ADMIN("Administrator"),
    ROLE_EMPLOYEE("Employee"),
    ROLE_CUSTOMER("Customer");

    private final String name;

    public static UserRole fromString(String role) {
        for (UserRole roleName : UserRole.values()) {
            if (roleName.name().equalsIgnoreCase(role)) {
                return roleName;
            }
        }
        throw new IllegalArgumentException("No enum constant for the role: " + role);
    }
}
