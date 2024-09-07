import { AxiosResponse } from "axios";
import { User } from "../models/User";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const userEndpoint: string = "/users";
const userClient = createAxiosClient(basePath);

export const getAllUsers = async (
  queryParams: {
    phoneNumber?: string;
    email?: string;
    name?: string;
    surname?: string;
    role?: string;
    tariffId?: number;
    limit?: number;
    offset?: number;
  } = {},
  abortController: AbortController
): Promise<{
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsOnPage: number;
  };
}> => {
  const response: AxiosResponse<{
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsOnPage: number;
    };
  }> = await userClient.get(basePath + userEndpoint, {
    params: queryParams,
    signal: abortController.signal,
  });
  return response.data;
};

export const getUserById = async (
  id: number,
  abortController: AbortController
): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await userClient.get(
    `${basePath}${userEndpoint}/${id}`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const createUser = async (
  user: User,
  abortController: AbortController
): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await userClient.post(
    basePath + userEndpoint,
    user,
    { signal: abortController.signal }
  );
  return response.data;
};

export const updateUser = async (
  user: User,
  abortController: AbortController
): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await userClient.put(
    basePath + userEndpoint,
    user,
    { signal: abortController.signal }
  );
  return response.data;
};

export const deleteUser = async (
  id: number,
  abortController: AbortController
): Promise<void> => {
  await userClient.delete(`${basePath}${userEndpoint}/${id}`, {
    signal: abortController.signal,
  });
};
