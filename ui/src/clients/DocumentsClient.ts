import createAxiosClient from "./AxiosClient";
import { DocumentFile } from "../models/Document";

const basePath: string = "http://localhost:8080";
const documentEndpoint: string = "/document";

const documentClient = createAxiosClient(basePath);

export const getDocumentsList = async (
  userId: string,
  abortController: AbortController
): Promise<{ files: DocumentFile[] }> => {
  const response = await documentClient.get(documentEndpoint, {
    params: { userId },
    signal: abortController.signal,
  });
  return response.data;
};

export const uploadDocument = async (
  file: File,
  fileName: string,
  userId: number,
  abortController: AbortController
): Promise<{ documentId: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  formData.append("userId", userId.toString());

  const response = await documentClient.post(documentEndpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: abortController.signal,
  });
  return response.data;
};

export const downloadDocument = async (
  id: string,
  abortController: AbortController
): Promise<Blob> => {
  const response = await documentClient.get(`${documentEndpoint}/${id}`, {
    responseType: "blob",
    signal: abortController.signal,
  });
  return response.data;
};

export const deleteDocument = async (
  id: string,
  abortController: AbortController
): Promise<void> => {
  await documentClient.delete(`${documentEndpoint}/${id}`, {
    signal: abortController.signal,
  });
};
