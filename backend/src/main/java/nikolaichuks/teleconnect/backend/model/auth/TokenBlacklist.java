package nikolaichuks.teleconnect.backend.model.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import nikolaichuks.teleconnect.backend.model.user.User;

import java.time.LocalDateTime;

/**
 * TokenBlacklist entity
 */
@Getter
@Setter
@Entity
@Table(name = "token_blacklist")
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    private LocalDateTime expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
