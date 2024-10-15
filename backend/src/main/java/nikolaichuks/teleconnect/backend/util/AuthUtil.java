package nikolaichuks.teleconnect.backend.util;

import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.model.user.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    public boolean hasEmployeeRole() {
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }

    public boolean hasEmployeeRoleOrEqualToUserId(String userId) {
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE) || userId.equals(currentUser.getId().toString());
    }
}
