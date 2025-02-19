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
    limit?: number;
    offset?: number;
  },
  abortController: AbortController
): Promise<{
  tariffs: Tariff[];
  currentPage: number;
  totalPages: number;
}> => {
  const response = await tariffClient.get(basePath + tariffEndpoint, {
    params: queryParams,
    signal: abortController.signal,
  });
  return response.data;
};

export const getTariffById = async (
  id: number,
  abortController: AbortController
): Promise<Tariff | undefined> => {
  const response = await tariffClient.get(
    `${basePath}${tariffEndpoint}/${id}`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const createTariff = async (
  tariff: Tariff,
  abortController: AbortController
): Promise<Tariff | undefined> => {
  const response = await tariffClient.post(basePath + tariffEndpoint, tariff, {
    signal: abortController.signal,
  });
  return response.data;
};

export const updateTariff = async (
  tariff: Tariff,
  abortController: AbortController
): Promise<Tariff | undefined> => {
  const response = await tariffClient.put(basePath + tariffEndpoint, tariff, {
    signal: abortController.signal,
  });
  return response.data;
};

export const deleteTariff = async (
  id: number,
  abortController: AbortController
): Promise<void> => {
  await tariffClient.delete(`${basePath}${tariffEndpoint}/${id}`, {
    signal: abortController.signal,
  });
};

export const getTariffByUserId = async (
  userId: number,
  abortController: AbortController
): Promise<Tariff | undefined> => {
  const response = await tariffClient.get(
    `${basePath}${tariffEndpoint}/user/${userId}`,
    { signal: abortController.signal }
  );
  return response.data;
};
