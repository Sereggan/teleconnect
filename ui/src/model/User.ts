import { Tariff } from "./Tariff";

export interface User {
  id: number;
  phoneNumber: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  tariff?: Tariff;
}
