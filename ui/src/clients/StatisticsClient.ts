import {
  UserByTariffResponse,
  AdjustmentByTariffResponse,
  MostDiscountedTariffResponse,
  UsersWithoutTariffResponse,
} from "../models/Statistics";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const statisticsEndpoint: string = "/statistics";

const statisticsClient = createAxiosClient(basePath);

export const getUsersByTariff = async (): Promise<UserByTariffResponse[]> => {
  const response = await statisticsClient.get(
    `${statisticsEndpoint}/users-by-tariff`
  );
  return response.data;
};

export const getUsersWithoutTariff =
  async (): Promise<UsersWithoutTariffResponse> => {
    const response = await statisticsClient.get(
      `${statisticsEndpoint}/users-without-tariff`
    );
    return response.data;
  };

export const getAdjustmentsByTariff = async (): Promise<
  AdjustmentByTariffResponse[]
> => {
  const response = await statisticsClient.get(
    `${statisticsEndpoint}/adjustments-by-tariff`
  );
  return response.data;
};

export const getMostDiscountedTariff =
  async (): Promise<MostDiscountedTariffResponse> => {
    const response = await statisticsClient.get(
      `${statisticsEndpoint}/most-discounted-tariff`
    );
    return response.data;
  };
