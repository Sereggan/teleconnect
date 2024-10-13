package nikolaichuks.teleconnect.backend.model.document;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nikolaichuks.teleconnect.backend.model.user.User;

/**
 * Entity for storing document information associated with a user
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_documents")
public class UserDocuments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String documentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}