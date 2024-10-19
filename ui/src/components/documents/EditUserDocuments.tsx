import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  deleteDocument,
  downloadDocument,
  getDocumentsList,
  uploadDocument,
} from "../../clients/DocumentsClient";
import { DocumentFile } from "../../models/Document";

export default function EditUserDocuments() {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<DocumentFile[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchDocuments = async (controller: AbortController) => {
      if (id) {
        setIsLoading(true);
        setError("");
        try {
          const documents = await getDocumentsList(id, controller);
          if (documents) {
            setDocuments(documents.files);
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            console.log(error);
            setError("Error fetching documents");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    controllerRef.current = new AbortController();
    fetchDocuments(controllerRef.current);

    return () => {
      controllerRef.current?.abort();
    };
  }, [id]);

  function downloadFile(file: DocumentFile) {
    controllerRef.current = new AbortController();

    downloadDocument(file.documentId, controllerRef.current)
      .then((response) => {
        const fileURL = window.URL.createObjectURL(response);
        const alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = file.originalFileName;
        document.body.appendChild(alink);
        alink.click();
        document.body.removeChild(alink);

        window.URL.revokeObjectURL(fileURL);
      })
      .catch((error) => {
        if (!controllerRef.current?.signal.aborted) {
          console.error("Error during file download:", error);
        }
      });
  }

  async function deleteFile(file: DocumentFile) {
    controllerRef.current = new AbortController();
    if (id) {
      try {
        setIsLoading(true);
        await deleteDocument(file.documentId, controllerRef.current);

        const updatedDocuments = await getDocumentsList(
          id,
          new AbortController()
        );
        setDocuments(updatedDocuments.files);
      } catch (error) {
        if (!controllerRef.current?.signal.aborted) {
          setError("Error during file deletion:");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Empty user id");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  async function handleUploadFile() {
    if (id && selectedFile) {
      controllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        setError("");
        setSuccessMessage("");

        await uploadDocument(
          selectedFile,
          selectedFile.name,
          parseInt(id),
          controllerRef.current
        );
        setSuccessMessage(`File uploaded successfully.`);
        const updatedDocuments = await getDocumentsList(
          id,
          new AbortController()
        );
        setDocuments(updatedDocuments.files);
      } catch (error) {
        setError("Error uploading the document");
      } finally {
        setIsLoading(false);
      }
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 KB";

    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  if (isLoading) {
    <div className="d-flex justify-content-center my-4">
      <Spinner animation="border" />;
    </div>;
  }

  if (error) {
    return (
      <Alert variant="danger">Something went wrong during download.</Alert>
    );
  }

  return (
    <Container>
      <h2>Customer's documents:</h2>
      {documents?.length ? (
        <ListGroup>
          {documents.map((document) => (
            <ListGroup.Item
              key={document.documentId}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{document.originalFileName}</span>
              <span className="text-muted ml-2">
                ({formatFileSize(document.fileSize)})
              </span>
              <Button variant="primary" onClick={() => downloadFile(document)}>
                Download
              </Button>
              <Button variant="primary" onClick={() => deleteFile(document)}>
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No documents available.</p>
      )}

      <Container className="mt-4">
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Document</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
          <Button
            variant="primary"
            onClick={handleUploadFile}
            disabled={!selectedFile}
          >
            Upload
          </Button>
          {selectedFile && (
            <Form.Text>
              {selectedFile.name} {formatFileSize(selectedFile.size)}
            </Form.Text>
          )}
        </Form.Group>
        {successMessage && (
          <Row className="mt-3">
            <Col>
              <Alert variant="success">{successMessage}</Alert>
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
}
