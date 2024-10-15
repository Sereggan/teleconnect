package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.document.Documents;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentsRepository extends JpaRepository<Documents, Integer> {
    List<Documents> findAllByUserId(Integer userId);
    void deleteByDocumentId(String documentId);
    Optional<Documents> findByDocumentId(String documentId);
}
