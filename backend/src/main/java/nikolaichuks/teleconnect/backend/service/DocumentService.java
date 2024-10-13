package nikolaichuks.teleconnect.backend.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.model.User;
import nikolaichuks.teleconnect.backend.model.UserDocuments;
import nikolaichuks.teleconnect.backend.repository.UserDocumentsRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import teleconnect.document.model.DocumentListResponse;
import teleconnect.document.model.UploadDocumentResponse;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final UserDocumentsRepository userDocumentsRepository;
    private final UserRepository userRepository;

    @Value("${document.filePath}")
    String basePath;
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10 MB

    public Resource downloadDocument(String id) {
        try {
            Path filePath = Paths.get(basePath).toAbsolutePath().normalize().resolve(id).normalize();

            if (!Files.exists(filePath)) {
                throw new CustomRestException("Document not found: " + id, HttpStatus.NOT_FOUND);
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new CustomRestException("Resource not found: " + id, HttpStatus.NOT_FOUND);
            }
        } catch (MalformedURLException ex) {
            throw new CustomRestException("Error while reading document: " + id, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public DocumentListResponse getDocumentsList(String userId) {
        List<String> documents = userDocumentsRepository.findAllByUserId(Integer.parseInt(userId)).stream()
                .map(UserDocuments::getDocumentId)
                .toList();
        DocumentListResponse response = new DocumentListResponse();
        response.setFiles(documents);
        return response;
    }

    @Transactional
    public UploadDocumentResponse uploadFile(@Valid String fileName, MultipartFile file, @Valid Integer userId) {
        if (file.isEmpty()) {
            throw new CustomRestException("File is empty", HttpStatus.BAD_REQUEST);
        }
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new CustomRestException("File type is not supported. Only .doc, .docx, and .pdf are allowed.", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new CustomRestException("File size exceeds the maximum allowed size of 10 MB", HttpStatus.BAD_REQUEST);
        }

        String fileExtension = getFileExtension(fileName);
        if (!isAllowedExtension(fileExtension)) {
            throw new CustomRestException("File type is not supported. Only .doc, .docx, and .pdf are allowed.", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomRestException("User not found: " + userId, HttpStatus.NOT_FOUND));
        String generatedFileName = UUID.randomUUID() + "_" + sanitizeFileName(fileName);
        UserDocuments userDocuments = UserDocuments.builder()
                .documentId(generatedFileName)
                .user(user)
                .build();

        Path path = Paths.get(basePath, generatedFileName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

            userDocumentsRepository.save(userDocuments);

            UploadDocumentResponse response = new UploadDocumentResponse();
            response.setDocumentId(generatedFileName);
            return response;
        } catch (Exception e) {
            throw new CustomRestException("Error while saving document: " + generatedFileName, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public void deleteDocument(String id) {
        Path path = Paths.get(basePath, id);
        try {
            if (Files.exists(path)) {
                Files.delete(path);
                userDocumentsRepository.deleteByDocumentId(id);
            } else {
                throw new CustomRestException("File not found: " + id, HttpStatus.NOT_FOUND);
            }
        } catch (IOException e) {
            throw new CustomRestException("Error deleting file: " + id, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9\\._-]", "_");
    }

    private boolean isAllowedExtension(String fileExtension) {
        return fileExtension.equals("doc") || fileExtension.equals("docx") || fileExtension.equals("pdf");
    }

    private String getFileExtension(String fileName) {
        String extension = "";
        int lastIndexOfDot = fileName.lastIndexOf('.');
        if (lastIndexOfDot > 0 && lastIndexOfDot < fileName.length() - 1) {
            extension = fileName.substring(lastIndexOfDot + 1).toLowerCase();
        }
        return extension;
    }

    private boolean isAllowedContentType(String contentType) {
        return contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/pdf");
    }
}
