// services/StatisticsClient.ts
import axios, { AxiosResponse } from "axios";
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
  const response: AxiosResponse<UserByTariffResponse[]> =
    await statisticsClient.get(`${statisticsEndpoint}/users-by-tariff`);
  return response.data;
};

export const getUsersWithoutTariff =
  async (): Promise<UsersWithoutTariffResponse> => {
    const response: AxiosResponse<UsersWithoutTariffResponse> =
      await statisticsClient.get(`${statisticsEndpoint}/users-without-tariff`);
    return response.data;
  };

export const getAdjustmentsByTariff = async (): Promise<
  AdjustmentByTariffResponse[]
> => {
  const response: AxiosResponse<AdjustmentByTariffResponse[]> =
    await statisticsClient.get(`${statisticsEndpoint}/adjustments-by-tariff`);
  return response.data;
};

export const getMostDiscountedTariff =
  async (): Promise<MostDiscountedTariffResponse> => {
    const response: AxiosResponse<MostDiscountedTariffResponse> =
      await statisticsClient.get(
        `${statisticsEndpoint}/most-discounted-tariff`
      );
    return response.data;
  };
