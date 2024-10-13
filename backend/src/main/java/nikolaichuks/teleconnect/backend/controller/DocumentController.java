package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import teleconnect.document.api.DocumentApi;
import teleconnect.document.model.DocumentListResponse;
import teleconnect.document.model.UploadDocumentResponse;

@RestController
@RequiredArgsConstructor
public class DocumentController implements DocumentApi {

    private final DocumentService documentService;

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(String id) {
        return ResponseEntity.ok(documentService.downloadDocument(id));

    }

    @Override
    public ResponseEntity<DocumentListResponse> getDocumentsList(String userId) {
        return ResponseEntity.ok(documentService.getDocumentsList(userId));
    }

    @Override
    public ResponseEntity<UploadDocumentResponse> uploadFile(String fileName, MultipartFile file, Integer userId) {
        return new ResponseEntity<>(documentService.uploadFile(fileName, file, userId), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<Void> deleteDocument(String id) {
        documentService.deleteDocument(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
