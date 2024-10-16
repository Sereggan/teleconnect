export interface UserByTariffResponse {
  tariffName: string;
  userCount: number;
}

export interface UsersWithoutTariffResponse {
  count: number;
}

export interface TariffAgeGroupStatisticsResponse {
  tariffName: string;
  ageGroup: string;
  userCount: number;
}

export interface TariffAdjustmentCountResponse {
  tariffName: string;
  adjustmentCount: number;
}
