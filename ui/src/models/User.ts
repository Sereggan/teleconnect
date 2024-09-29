export enum UserRole {
  ROLE_EMPLOYEE = "Employee",
  ROLE_CUSTOMER = "Customer",
}

export interface User {
  id?: number;
  phoneNumber: string;
  password: string;
  email: string;
  name: string;
  familyName: string;
  role: UserRole;
  birthDate?: string;
  tariffId?: number;
  tariffAdjustmentId?: number;
}
