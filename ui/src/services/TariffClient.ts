import axios, { AxiosResponse } from "axios";
import { Tariff } from "../model/Tariff";

const basePath: string = "http://localhost:8080";
const tariffEndpoint: string = "/tariff";

export const getAllTariffs = async () => {
  try {
    const response: AxiosResponse<Tariff[]> = await axios.get(
      basePath + tariffEndpoint
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
