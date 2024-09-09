export interface TariffAdjustment {
  id?: number;
  userId: number;
  tariffId: number;
  adjustedDataLimit?: number;
  adjustedCallMinutes?: number;
  adjustedSmsLimit?: number;
  discountPercentage?: number;
}
