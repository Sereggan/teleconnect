export interface Tariff {
  id: number;
  name: string;
  price: number;
  description: string;
  dataLimit: number;
  callMinutes: number;
  smsLimit: number;
  isActive: boolean;
}
