package nikolaichuks.teleconnect.backend.model.document;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nikolaichuks.teleconnect.backend.model.user.User;

import java.time.LocalDateTime;

/**
 * Entity for storing document information associated with a user
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documents")
public class Documents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String documentId;
    private String originalFileName;
    private LocalDateTime creationTime;
    private Integer fileSize;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}