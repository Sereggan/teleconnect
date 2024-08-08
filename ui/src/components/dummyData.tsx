export interface User {
  id: number;
  username: string;
  phoneNumber: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  tariff?: Tariff;
}

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

export const tariffs: Tariff[] = [
  {
    id: 1,
    name: "Basic Plan",
    price: 19.99,
    description: "Basic mobile plan",
    dataLimit: 5000,
    callMinutes: 1000,
    smsLimit: 100,
    isActive: true,
  },
  {
    id: 2,
    name: "Premium Plan",
    price: 39.99,
    description: "Premium mobile plan",
    dataLimit: 10000,
    callMinutes: 2000,
    smsLimit: 500,
    isActive: true,
  },
];

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    phoneNumber: "0000000000",
    email: "admin@example.com",
    name: "Admin",
    surname: "User",
    role: "ROLE_ADMIN",
  },
  {
    id: 2,
    username: "employee",
    phoneNumber: "1111111111",
    email: "employee@example.com",
    name: "Employee",
    surname: "User",
    role: "ROLE_EMPLOYEE",
  },
  {
    id: 3,
    username: "customer",
    phoneNumber: "1234567890",
    email: "customer@example.com",
    name: "Customer",
    surname: "User",
    role: "ROLE_CUSTOMER",
    tariff: tariffs[0],
  },
];
