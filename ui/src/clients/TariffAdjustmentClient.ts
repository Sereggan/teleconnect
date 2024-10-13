import { TariffAdjustment } from "../models/TariffAdjustment";
import createAxiosClient from "./AxiosClient";

const basePath: string = "http://localhost:8080";
const adjustmentEndpoint: string = "/tariff-adjustment";
const adjustmentClient = createAxiosClient(basePath);

export const getTariffAdjustment = async (
  userId: number,
  abortController: AbortController
): Promise<TariffAdjustment | undefined> => {
  const response = await adjustmentClient.get(
    `${basePath}${adjustmentEndpoint}/${userId}`,
    { signal: abortController.signal }
  );
  return response.data;
};

export const updateTariffAdjustment = async (
  adjustment: TariffAdjustment,
  abortController: AbortController
): Promise<TariffAdjustment | undefined> => {
  const response = await adjustmentClient.put(
    `${basePath}${adjustmentEndpoint}`,
    adjustment,
    { signal: abortController.signal }
  );
  return response.data;
};

export const deleteTariffAdjustment = async (
  id: number,
  abortController: AbortController
): Promise<void> => {
  await adjustmentClient.delete(`${basePath}${adjustmentEndpoint}/${id}`, {
    signal: abortController.signal,
  });
};
