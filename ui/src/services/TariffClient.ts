import { AxiosResponse } from "axios";
import { Tariff } from "../models/Tariff";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const tariffEndpoint: string = "/tariff";
const tariffClient = createAxiosClient(basePath);

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
  } = {},
  abortController: AbortController
): Promise<Tariff[] | undefined> => {
  const response: AxiosResponse<Tariff[]> = await tariffClient.get(
    basePath + tariffEndpoint,
    {
      params: queryParams,
      signal: abortController.signal,
    }
  );
  return response.data;
};

export const getTariffById = async (
  id: number
): Promise<Tariff | undefined> => {
  const response: AxiosResponse<Tariff> = await tariffClient.get(
    `${basePath}${tariffEndpoint}/${id}`
  );
  return response.data;
};

export const createTariff = async (
  tariff: Tariff
): Promise<Tariff | undefined> => {
  const response: AxiosResponse<Tariff> = await tariffClient.post(
    basePath + tariffEndpoint,
    tariff
  );
  return response.data;
};

export const updateTariff = async (
  tariff: Tariff
): Promise<Tariff | undefined> => {
  const response: AxiosResponse<Tariff> = await tariffClient.put(
    basePath + tariffEndpoint,
    tariff
  );
  return response.data;
};

export const deleteTariff = async (id: number): Promise<void> => {
  await tariffClient.delete(`${basePath}${tariffEndpoint}/${id}`);
};
