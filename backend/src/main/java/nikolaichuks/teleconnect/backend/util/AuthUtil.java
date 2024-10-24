package nikolaichuks.teleconnect.backend.util;

import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.model.user.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {


    public boolean hasEmployeeRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE);
    }

    public boolean hasEmployeeRoleOrEqualToUserId(String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getRole().equals(UserRole.ROLE_EMPLOYEE) || userId.equals(currentUser.getId().toString());
    }
}
