package nikolaichuks.teleconnect.backend.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Getter
@RequiredArgsConstructor
public enum UserRole implements GrantedAuthority {
    ROLE_EMPLOYEE("Employee"),
    ROLE_CUSTOMER("Customer");

    private final String name;

    public static UserRole fromString(String role) {
        for (UserRole roleName : UserRole.values()) {
            if (roleName.getName().equalsIgnoreCase(role)) {
                return roleName;
            }
        }
        throw new IllegalArgumentException("No enum constant for the role: " + role);
    }

    @Override
    public String getAuthority() {
        return name;
    }
}
