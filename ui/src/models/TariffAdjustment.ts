export interface TariffAdjustment {
  id?: number;
  userId: number;
  tariffId: number;
  dataLimit?: number;
  callMinutes?: number;
  smsLimit?: number;
  price?: number;
}
