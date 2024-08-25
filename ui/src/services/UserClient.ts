import axios, { AxiosResponse } from "axios";
import { User } from "../models/User";

const basePath: string = "http://localhost:8080";
const userEndpoint: string = "/users";

export const getAllUsers = async (): Promise<User[] | undefined> => {
  const response: AxiosResponse<User[]> = await axios.get(
    basePath + userEndpoint
  );
  return response.data;
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await axios.get(
    `${basePath}${userEndpoint}/${id}`
  );
  return response.data;
};

export const createUser = async (user: User): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await axios.post(
    basePath + userEndpoint,
    user
  );
  return response.data;
};

export const updateUser = async (user: User): Promise<User | undefined> => {
  const response: AxiosResponse<User> = await axios.put(
    basePath + userEndpoint,
    user
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${basePath}${userEndpoint}/${id}`);
};
