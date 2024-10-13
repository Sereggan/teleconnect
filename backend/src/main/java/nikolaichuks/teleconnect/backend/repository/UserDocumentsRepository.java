package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.UserDocuments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDocumentsRepository extends JpaRepository<UserDocuments, Integer> {
    List<UserDocuments> findAllByUserId(Integer userId);
    void deleteByDocumentId(String documentId);
}
