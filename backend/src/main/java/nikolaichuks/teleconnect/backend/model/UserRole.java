package nikolaichuks.teleconnect.backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Data
@Entity
@Builder
@Table(name = "user_role")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private UserRoleName name;

    @OneToMany(mappedBy = "role")
    private Set<User> users;

}