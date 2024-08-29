import { AxiosResponse } from "axios";
import { User } from "../models/User";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const userEndpoint: string = "/users";
const userClient = createAxiosClient(basePath);

export const getAllUsers = async (): Promise<User[] | undefined> => {
  const response: AxiosResponse<User[]> = await userClient.get(
    basePath + userEndpoint
  );
  return response.data;
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await userClient.get(
    `${basePath}${userEndpoint}/${id}`
  );
  return response.data;
};

export const createUser = async (user: User): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await userClient.post(
    basePath + userEndpoint,
    user
  );
  return response.data;
};

export const updateUser = async (user: User): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await userClient.put(
    basePath + userEndpoint,
    user
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await userClient.delete(`${basePath}${userEndpoint}/${id}`);
};
