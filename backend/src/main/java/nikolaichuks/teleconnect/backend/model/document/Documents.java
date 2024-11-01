package nikolaichuks.teleconnect.backend.model.document;


import jakarta.persistence.*;
import lombok.*;
import nikolaichuks.teleconnect.backend.model.user.User;

import java.time.OffsetDateTime;

/**
 * Entity for storing document information associated with a user
 */
@Data
@Entity
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "documents")
public class Documents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String documentId;
    private String originalFileName;
    private OffsetDateTime createdAt;
    private Integer fileSize;
    @Column(name = "data", columnDefinition="bytea")
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}