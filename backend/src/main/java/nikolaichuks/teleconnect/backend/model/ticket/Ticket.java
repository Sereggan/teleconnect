package nikolaichuks.teleconnect.backend.model.ticket;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nikolaichuks.teleconnect.backend.model.user.User;

import java.time.LocalDateTime;

/**
 * Entity for storing ticket information.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;
    private String resolution;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum Status {
        New, InProgress, Resolved, Rejected
    }
}