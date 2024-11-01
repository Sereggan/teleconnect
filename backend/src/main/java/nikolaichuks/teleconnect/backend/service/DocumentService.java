package nikolaichuks.teleconnect.backend.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.document.Documents;
import nikolaichuks.teleconnect.backend.model.user.User;
import nikolaichuks.teleconnect.backend.repository.DocumentsRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import nikolaichuks.teleconnect.backend.util.AuthUtil;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import teleconnect.document.model.DocumentFile;
import teleconnect.document.model.DocumentListResponse;
import teleconnect.document.model.UploadDocumentResponse;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final DocumentsRepository documentsRepository;
    private final MapperUtil mapperUtil;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10 MB

    public Resource downloadDocument(String id) {
        Documents document = documentsRepository.findByDocumentId(id)
                .orElseThrow(() -> new CustomRestException("Document not found: " + id, HttpStatus.NOT_FOUND));

        if (!authUtil.hasEmployeeRoleOrEqualToUserId(document.getUser().getId().toString())) {
            throw new CustomRestException("Access denied", HttpStatus.FORBIDDEN);
        }

        return new ByteArrayResource(document.getData());
    }

    public DocumentListResponse getDocumentsList(String userId) {
        List<DocumentFile> documents = documentsRepository.findAllByUserId(Integer.parseInt(userId)).stream()
                .map(mapperUtil::mapDocumentToDocumentFile)
                .toList();
        DocumentListResponse response = new DocumentListResponse();
        response.setFiles(documents);
        return response;
    }

    public UploadDocumentResponse uploadFile(@Valid String fileName, MultipartFile file, @Valid Integer userId) {
        validateFile(fileName, file);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomRestException("User not found: " + userId, HttpStatus.NOT_FOUND));
        String sanitizedFileName = sanitizeFileName(fileName);
        String generatedFileName = UUID.randomUUID() + "_" + sanitizedFileName;
        try {
            Documents document = Documents.builder()
                    .documentId(generatedFileName)
                    .originalFileName(sanitizedFileName)
                    .createdAt(OffsetDateTime.now())
                    .fileSize((int) file.getSize())
                    .user(user)
                    .data(file.getBytes())
                    .build();
            documentsRepository.save(document);

            UploadDocumentResponse response = new UploadDocumentResponse();
            response.setDocumentId(generatedFileName);
            return response;
        } catch (IOException e) {
            throw new CustomRestException("Could not store file: " + userId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void deleteDocument(String id) {
        documentsRepository.findByDocumentId(id)
                .ifPresentOrElse(documentsRepository::delete, () -> {
                    throw new CustomRestException("Document not found: " + id, HttpStatus.NOT_FOUND);
                });
    }

    private void validateFile(String fileName, MultipartFile file) {
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

        if(fileName.length()>250){
            throw new CustomRestException("Filename is too long. Maximum length is 250 characters.", HttpStatus.BAD_REQUEST);
        }
    }

    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^\\p{L}\\p{N}._-]", "_");
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
