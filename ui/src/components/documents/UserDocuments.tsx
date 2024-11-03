import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, ListGroup, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  downloadDocument,
  getDocumentsList,
} from "../../clients/DocumentsClient";
import { DocumentFile } from "../../models/Document";

export default function UserDocument() {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<DocumentFile[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchDocuments = async (controller: AbortController) => {
      if (id) {
        setIsLoading(true);
        setError("");
        try {
          setError("");
          const documents = await getDocumentsList(id, controller);
          if (documents) {
            setDocuments(documents.files);
          }
        } catch (error) {
          if (!controller.signal.aborted) {
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
      <h2>My Documents:</h2>
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
              <span>{new Date(document.createdAt).toLocaleString()}</span>
              <Button variant="primary" onClick={() => downloadFile(document)}>
                Download
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No documents available.</p>
      )}
    </Container>
  );
}
