package nikolaichuks.teleconnect.backend.model.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import nikolaichuks.teleconnect.backend.model.user.User;

import java.time.LocalDateTime;

/**
 * Password reset token entity
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "password_reset_token")
@Accessors(chain = true)
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime expiryDate;
}
