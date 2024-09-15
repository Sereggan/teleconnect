export interface UserByTariffResponse {
  tariffName: string;
  userCount: number;
}

export interface AdjustmentByTariffResponse {
  tariffName: string;
  adjustmentCount: number;
}

export interface MostDiscountedTariffResponse {
  tariffName: string;
  averageDiscount: number;
}

export interface UsersWithoutTariffResponse {
  count: number;
}
