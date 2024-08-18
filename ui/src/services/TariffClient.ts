import axios, { AxiosResponse } from "axios";
import { Tariff } from "../models/Tariff";

const basePath: string = "http://localhost:8080";
const tariffEndpoint: string = "/tariff";

export const getAllTariffs = async (): Promise<Tariff[] | undefined> => {
  try {
    const response: AxiosResponse<Tariff[]> = await axios.get(
      basePath + tariffEndpoint
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tariffs:", error);
  }
};

export const getTariffById = async (
  id: number
): Promise<Tariff | undefined> => {
  try {
    const response: AxiosResponse<Tariff> = await axios.get(
      `${basePath}${tariffEndpoint}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching tariff with ID ${id}:`, error);
  }
};

export const createTariff = async (
  tariff: Tariff
): Promise<Tariff | undefined> => {
  try {
    const response: AxiosResponse<Tariff> = await axios.post(
      basePath + tariffEndpoint,
      tariff
    );
    return response.data;
  } catch (error) {
    console.error("Error creating tariff:", error);
  }
};

export const updateTariff = async (
  id: number,
  tariff: Tariff
): Promise<Tariff | undefined> => {
  try {
    const response: AxiosResponse<Tariff> = await axios.put(
      `${basePath}${tariffEndpoint}/${id}`,
      tariff
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating tariff with ID ${id}:`, error);
  }
};

export const deleteTariff = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${basePath}${tariffEndpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting tariff with ID ${id}:`, error);
  }
};
