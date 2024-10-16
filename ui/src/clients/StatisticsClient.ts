import {
  UserByTariffResponse,
  UsersWithoutTariffResponse,
  TariffAgeGroupStatisticsResponse,
  TariffAdjustmentCountResponse,
} from "../models/Statistics";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const statisticsEndpoint: string = "/statistics";

const statisticsClient = createAxiosClient(basePath);

export const getUsersByTariff = async (
  abortController: AbortController
): Promise<UserByTariffResponse[]> => {
  const response = await statisticsClient.get(
    `${statisticsEndpoint}/users-by-tariff`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const getUsersWithoutTariff = async (
  abortController: AbortController
): Promise<UsersWithoutTariffResponse> => {
  const response = await statisticsClient.get(
    `${statisticsEndpoint}/users-without-tariff`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const getTariffAgeGroupStatistics = async (
  abortController: AbortController
): Promise<TariffAgeGroupStatisticsResponse[]> => {
  const response = await statisticsClient.get(
    `${statisticsEndpoint}/tariff-age-group`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const getTariffAdjustmentCount = async (
  abortController: AbortController
): Promise<TariffAdjustmentCountResponse[]> => {
  const response = await statisticsClient.get(
    `${statisticsEndpoint}/tariff-adjustment-count`,
    { signal: abortController.signal }
  );
  return response.data;
};
