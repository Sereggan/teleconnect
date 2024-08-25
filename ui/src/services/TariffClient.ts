import axios, { AxiosResponse } from "axios";
import { Tariff } from "../models/Tariff";

const basePath: string = "http://localhost:8080";
const tariffEndpoint: string = "/tariff";

export const getAllTariffs = async (
  queryParams: {
    priceMin?: number;
    priceMax?: number;
    dataLimitMin?: number;
    dataLimitMax?: number;
    callMinutesMin?: number;
    callMinutesMax?: number;
    smsLimitMin?: number;
    smsLimitMax?: number;
    isActive?: boolean;
    isUsed?: boolean;
  } = {}
): Promise<Tariff[] | undefined> => {
  const response: AxiosResponse<Tariff[]> = await axios.get(
    basePath + tariffEndpoint,
    {
      params: queryParams,
    }
  );
  return response.data;
};

export const getTariffById = async (
  id: number
): Promise<Tariff | undefined> => {
  const response: AxiosResponse<Tariff> = await axios.get(
    `${basePath}${tariffEndpoint}/${id}`
  );
  return response.data;
};

export const createTariff = async (
  tariff: Tariff
): Promise<Tariff | undefined> => {
  const response: AxiosResponse<Tariff> = await axios.post(
    basePath + tariffEndpoint,
    tariff
  );
  return response.data;
};

export const updateTariff = async (
  tariff: Tariff
): Promise<Tariff | undefined> => {
  const response: AxiosResponse<Tariff> = await axios.put(
    basePath + tariffEndpoint,
    tariff
  );
  return response.data;
};

export const deleteTariff = async (id: number): Promise<void> => {
  await axios.delete(`${basePath}${tariffEndpoint}/${id}`);
};
