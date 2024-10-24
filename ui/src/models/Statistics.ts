export interface UserByTariffResponse {
  tariffName: string;
  userCount: number;
}

export interface UsersWithoutTariffResponse {
  count: number;
}

export interface TariffAdjustmentCountResponse {
  tariffName: string;
  adjustmentCount: number;
}
